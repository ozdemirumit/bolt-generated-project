import React, { useState, useEffect } from 'react'
import AWS from 'aws-sdk'

const ENDPOINT = 'https://splunkfrozen.hcpv104.odeabank.com.tr'
const TOKEN = 'U3BsdW5r:130dc1ad572a41397a17ce59be573944'

function App() {
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const s3 = new AWS.S3({
      endpoint: ENDPOINT,
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    })

    const listObjects = async () => {
      try {
        const data = await s3.listObjects({ Bucket: 'frozen' }).promise()
        setObjects(data.Contents || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    listObjects()
  }, [])

  if (loading) {
    return <div className="loading">Loading objects...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="container">
      <h1>S3 Object Browser</h1>
      <div className="object-list">
        {objects.length === 0 ? (
          <div>No objects found</div>
        ) : (
          objects.map((object, index) => (
            <div key={index} className="object-item">
              <div>Key: {object.Key}</div>
              <div>Size: {object.Size} bytes</div>
              <div>Last Modified: {object.LastModified.toString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
