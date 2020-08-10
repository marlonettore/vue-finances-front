import apollo from '@/plugins/apollo'
import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import md5 from 'md5'

import RecordCreateMutation from './../graphql/RecordCreate.gql'
import RecordsQuery from './../graphql/Records.gql'
import TotalBalanceQuery from './../graphql/TotalBalance.gql'

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      const month = moment(createRecord.date.substr(0, 10)).format('MM-YYYY')
      const variables = { month }

      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        recordsData.records = [...recordsData.records, createRecord]

        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (e) {
        console.log('Query Records ainda não lida', e)
      }

      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(createRecord.date.substr(0, 10))
        const variables = { date: currentDate.format('YYYY-MM-DD') }

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = +(totalBalanceData.totalBalance + createRecord.amount).toFixed(2)

          proxy.write({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('Query totalBalance ainda não lida', e)
      }
    }
  })
  return response.data.createRecord
}

const recordsWatchesQueries = {}

const records = variables => {
  const hashKey = md5(
    Object
      .keys(variables)
      .map(key => variables[key]).join('_')
  )
  let queryRef = recordsWatchesQueries[hashKey]

  if (!queryRef) {
    queryRef = apollo.watchQuery({
      query: RecordsQuery,
      variables
    })
    recordsWatchesQueries[hashKey] = queryRef
  }

  return from(queryRef)
    .pipe(
      map(response => response.data.records)
    )
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })
  return response.data.totalBalance
}

export default {
  createRecord,
  records,
  totalBalance
}
