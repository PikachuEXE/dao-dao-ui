import { useState, useEffect } from 'react'
import { useSigningClient } from 'contexts/cosmwasm'
import { ConfigResponse } from '@dao-dao/types/contracts/cw3-dao'

export function useDaoConfig(contractAddress: string) {
  let { signingClient } = useSigningClient()
  let [daoInfo, setDaoInfo] = useState<ConfigResponse>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let getDaoInfo = async () => {
      setLoading(true)
      let dao = await signingClient?.queryContractSmart(contractAddress, {
        get_config: {},
      })
      setDaoInfo(dao)
      setLoading(false)
    }
    getDaoInfo()
  }, [signingClient, contractAddress])

  return { daoInfo, loading }
}

export interface DaoListType {
  address: string
  name: string
  description: string
}

export function useDaosList(codeId: number) {
  const [daos, setDaos] = useState<Array<DaoListType>>([])
  const [loading, setLoading] = useState(false)
  const { signingClient } = useSigningClient()

  // Get list of DAO info
  useEffect(() => {
    if (!signingClient) {
      return
    }
    const getDaos = async () => {
      setLoading(true)
      let contracts = await signingClient?.getContracts(codeId)

      const daoList = []
      if (contracts) {
        for (let address of contracts) {
          const daoInfo = await signingClient?.queryContractSmart(address, {
            get_config: {},
          })
          if (daoInfo?.config) {
            const config = {
              ...daoInfo.config,
              address,
            }
            daoList.push(config)
          }
        }

        setDaos(daoList)
        setLoading(false)
      }
    }
    getDaos()
  }, [signingClient, codeId])

  return { daos, loading }
}