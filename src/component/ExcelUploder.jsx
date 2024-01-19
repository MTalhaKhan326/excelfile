import axios from "axios";
import React, { useEffect, useState } from 'react'
import AppImages from '../assets';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
const config ={
  "type": "service_account",
  "project_id": "one-call-59851",
  "private_key_id": "4e9b6a37f0674e7e3c2a271acffcd649035dd39c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDG8dQBuK5Q0ulB\nV90KMeDMltARXCCMu9IjGyGezE7SFdh/AsT9C8MV54/s4pw4DRlRsB3nBDhwpdx4\naeJHarav7RMIMQ0/LLqNtORM9DIrhtDwyhSkS0Tm5pSl6eSIzDEz1PNR0N4YkbiM\nZXEXf5SdHpnmITTC81rEvWcIQ5ATpqJGrh7ZSz6bBxJaceNr9QX4Ie53U1ALAsaD\n3et9lRH7xIj/I2tDXupPRmqhHgRQwJY0FCnTyaXo5iSbtAC2hO1rEa2Y0dHHOJQc\nJcSJtdX+bbUpYqBiy83nk5YQHG7QLOpgvYO8vphz/Wz0zsgHF3rrXBDyAuzlIbPX\nWegsOdDZAgMBAAECggEACksBP8yNEkfzQwr3d/tQKO2lmrxUP8vI6cGR2fwymMqC\nDsI3LGtzHrtCFky8Lec5l+EfjvAINoXSVBWQXEcQaCZBLZOSHqJjDYleJYAd52Qc\ng9TEwCJX0IV+C95/0TcVVZvvMdy3XPiPHo5yDTfv2bg3WLF/oBWErPiqr8IFHosR\nTgWLoq/cM9gN1TO4QcPyxdQ3GyzzQPtVbMjoi20WejxNd7+RYhTVKsZfRh4Rzz3O\nEJ3JMP8ZAj/uIxkHtl4jQjQRBVm6VJYN60aPecvxUvnwTwwo+djyMwjHJhupV3c9\nKn7FW/hKTpmyxClbqT5nk8JP9MROIuA86KAqD9ETLQKBgQD7R+f+yp2CAF0kD6VR\nJQ9CPStz5LPHlzMYz5dyBYCH1hcnA5uOhAEis3sgIW+4c3ly51dAN8EIL/EXQ42u\nNaEUvXoBY+/RLkScr0PmBFkA9ku2r/3mJveHv8Uwm2g6f0U2621rp5auXlHm4byG\nLr6XhfK+vpPF8Eo/fyofFBWgxQKBgQDKrk2AvF2aMt7ODa2jeRurGLcaEt+s2Smp\ngUm3CFS4tLpL86No4dpyy609D4TtmT6CAD/TCF9dWg8W0UHWWiuK40ksiwv3ZowA\n1n0iRg/7wBFJgLz3PJvkKJnHN61H9IZ8RPD5xTDNbAWuIzgFNhgCi9SDoNUG9/v+\nXi7w3XfJBQKBgQC6mSQrbhTXBCQmckPmZSnWm4wYDN6AOcSlCQtCjdlrhc09mI08\noMQjG7s0GgBXrdCjRi3hr0V2KfvTtcOReZu7xhTC0Y61/LDQ1coLFnFtqHiDGl/m\nOEuakAsD1HPq9LXWWa+wwQvBQqN5W2pfDnlUFhE0GlusIotQacNCvuxsrQKBgQCW\n9okHsEXPysAlng6NSnGPWRNYumIb7oyXkpMDX5MrGIICfHBkeIUrKAXbCyophxEF\n54WifAP8Fk5S4n41WGhCRNSF9vNszNbO8PO3iZPyIbc+lkMpq905bfxMZG4OwFVD\nTl5my7dz6le4wsbBKu9rRhd+C1dgn2j0p9Yy1eKYuQKBgFit5BUcct98NHTXKgPX\nSGcWMfNjsauXSUeDNbvXynuSFdlBbjNiUdVO6EehjS+K6Fbf4DTt5NrAP+8Ve/bU\njd5BN1fVCFf1xAb2DRRRUx+FGrrk4Cl4GdFyWoia9SqtioXLA6txzGdxvwO5J73o\n7UTZ5RLDWtZJQj8cYKf22fho\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-k2389@one-call-59851.iam.gserviceaccount.com",
  "client_id": "110923276461897706665",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "storageBucket"     : "one-call-59851.appspot.com",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k2389%40one-call-59851.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
const app = initializeApp(config);
const storage = getStorage(app);
const ExcelUploder = () => {
    
  // State for the file
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading , setLoading] = useState(false)
  const[message, setMessage] = useState('')
  const[error, setError] = useState('')
  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true)
    setMessage('')
    setError('')

    if (!selectedFile) {
      console.error("No file selected");
      setMessage("No file selected")
      setLoading(false)
      return;
    }

    try {
      // Create a storage reference
      const storageRef = ref(storage, "ExcelFile" + selectedFile.name);

      // Upload the file to Firebase Storage
     await uploadBytes(storageRef, selectedFile);

     const downloadURL = await getDownloadURL(storageRef);

      console.log("File uploaded successfully! Download URL:", downloadURL);

      const result = await axios.get(
      `https://qmmrx3tzleuzomugcnsof7tolu0dylsf.lambda-url.eu-west-1.on.aws/polling-scheme/update-via-excel?file_url=${encodeURIComponent(downloadURL)}`)
      console.log("Resulttt",result)
      if(result.data.status == 200){
        setMessage("File Uploaded Sucessfully")
      }
       if(result.data.error == true){
        setError(result.data.message)
      }
      setLoading(false)
      setSelectedFile(null)

    //   console.log("File uploaded successfully!", data);
    } catch (error) {
      console.error("Error uploading file to Firebase Storage:", error.message);
      setLoading(false)
      setSelectedFile(null)
    } finally {
      // Clear form fields
      setSelectedFile(null);
    }
  };

  return (
 <div className="flex flex-col h-screen justify-center items-center">
      <form
        className="bg-white shadow-md mt-[200px] rounded px-8 pt-6 pb-8 mb-4 w-96"
        onSubmit={handleSubmit}
      >

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Upload Excel File:
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            id="file"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex items-center justify-between">
            {
                loading ? (<div className="text-[18px] text-blue-500">Loading....</div>) :(
                     <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
                )
            }
         
        </div>
        {
            message === ''?(''):(<div className="text-green-400 text-[15px] font-bold mt-4">{message}</div>)
        }
         {
            error === ''?(''):(<div className="text-red-400 text-[15px] font-bold mt-4">{error}</div>)
        }
      </form>
      <div className='text-[24px] my-[40px] font-semibold text-blue-500'>
        Set Excel file Format like this Excel file :
      </div>
      <div className='my-[40px]'>
        <img src={AppImages.ExcelImage} alt="" srcset="" className='w-full ' />
      </div>
    </div>
  )
}

export default ExcelUploder