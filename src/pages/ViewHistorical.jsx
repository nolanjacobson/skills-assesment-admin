import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import ViewHistoricalComponent from '../components/ViewHistoricalComponent'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
const ViewHistorical = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [token, setToken] = useState('')
  const [loaded, setLoaded] = useState(false)
  const getHistoricalRecordsWithoutPdf = async () => {
    const response = await axios.get(
      `https://new-nurse-2-nurse-api.herokuapp.com/api/NurseInformation/All`,
      { headers: { Authorization: 'Bearer ' + token } }
    )
    if (response.status === 200) {
      setHistoricalRecords(response.data)
      setLoaded(true)
    }
  }

  const getHistoricalRecordsWithPdf = async id => {
    const response = await axios.get(
      `https://new-nurse-2-nurse-api.herokuapp.com/api/NurseInformation/${id}`,
      { headers: { Authorization: 'Bearer ' + token } }
    )

    if (response.status === 200) {
      var link = document.createElement('a')
      link.href = response.data[0]

      //Set properties as you wise
      link.download = 'PDFData'
      link.target = 'blank'

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  const DeleteNurseRecord = async id => {
    const response = await axios.delete(
      `https://new-nurse-2-nurse-api.herokuapp.com/api/NurseInformation/${id}`,
      { headers: { Authorization: 'Bearer ' + token } }
    )
    if (response.status === 200) {
      alert(`Success!`)
      window.location.href = 'https://admin.nurse2nursestaffing.online/home'
    }
  }

  const Logout = () => {
    localStorage.removeItem('token')
    setLogoutRedirect(true)
  }

  useEffect(() => {
    const successfulToken = localStorage.getItem('token')
    if (!successfulToken) {
      setIsAuthenticated(false)
    }
    setToken(successfulToken)
  }, [])
  useEffect(() => {
    if (token !== '') {
      getHistoricalRecordsWithoutPdf()
    }
  }, [token])
  const [testDataPdf, setTestDataPdf] = useState([])

  const [historicalRecords, setHistoricalRecords] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [logoutRedirect, setLogoutRedirect] = useState(false)
  return (
    <>
      {redirect && <Redirect to="/home" />}
      {isAuthenticated ? (
        <>
          {logoutRedirect ? (
            <Redirect to="/" />
          ) : (
            <Button variant="danger" type="button" onClick={() => Logout()}>
              Logout
            </Button>
          )}
          <div className="centerButton">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setRedirect(true)}
            >
              Add Recruiter
            </Button>
          </div>

          <div className="reFlex">
            {loaded ? (
              historicalRecords
                .sort((a, b) =>
                  b.timeSubmitted < a.timeSubmitted
                    ? -1
                    : b.timeSubmitted > a.timeSubmitted
                    ? 1
                    : 0
                )
                .map(record => {
                  return (
                    <div>
                      <ViewHistoricalComponent
                        record={record}
                        loaded={loaded}
                        getHistoricalRecordsWithPdf={
                          getHistoricalRecordsWithPdf
                        }
                        DeleteNurseRecord={DeleteNurseRecord}
                      />
                    </div>
                  )
                })
            ) : (
              <Loader
                type="ThreeDots"
                color="#00BFFF"
                height={100}
                width={100}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <Redirect to="/" />
        </>
      )}
    </>
  )
}

export default ViewHistorical
