import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { getCoverLetterData } from '@/Services/coverLetterAPI';
import { addCoverLetterData } from '@/features/coverLetter/coverLetterFeatures';
// import CoverLetterForm from '../../components/CoverLetterForm';
import CoverLetterPreview from '../components/CoverLetterPreview';
import CoverLetterForm from '../components/CoverLetterForm';

function EditCoverLetter() {
  const { cover_letter_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCoverLetterData(cover_letter_id).then(resp => {
      console.log(resp);
      dispatch(addCoverLetterData(resp.data));
      setLoading(false);
    })
  }, [cover_letter_id])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
      {/* Form Section */}
      <CoverLetterForm />

      {/* Preview Section */}
      <CoverLetterPreview />
    </div>
  )
}

export default EditCoverLetter