import React from 'react'
import { useSelector } from 'react-redux'

function CoverLetterPreview() {
    const coverLetterInfo = useSelector((state) => state.editCoverLetter.coverLetterData);

    return (
        <div className='shadow-lg h-full p-14 border-t-[20px]'
            style={{
                borderColor: coverLetterInfo?.themeColor
            }}>
            {/* Header */}
            <div className='mb-10'>
                <h2 className='text-xl font-bold'
                    style={{
                        color: coverLetterInfo?.themeColor
                    }}
                >{coverLetterInfo?.fullName}</h2>
                <h2 className='text-sm font-medium'>{coverLetterInfo?.jobTitle}</h2>

                <div className='flex justify-between text-xs mt-3 text-gray-500'>
                    <span>{coverLetterInfo?.email}</span>
                    <span>{coverLetterInfo?.phone}</span>
                    <span>{coverLetterInfo?.address}, {coverLetterInfo?.city}, {coverLetterInfo?.state}</span>
                </div>
            </div>

            <hr className='border-[1.5px] my-5' style={{ borderColor: coverLetterInfo?.themeColor }} />

            {/* Body */}
            <div className='flex flex-col gap-5 text-sm'>
                <div className='flex flex-col gap-1'>
                    <span className='font-bold'>To:</span>
                    <span>{coverLetterInfo?.hiringManager}</span>
                    <span>{coverLetterInfo?.companyName}</span>
                </div>

                <div className='mt-5 whitespace-pre-wrap leading-relaxed'>
                    {coverLetterInfo?.summary}
                </div>

                <div className='mt-10'>
                    <p>Sincerely,</p>
                    <p className='font-bold mt-2'>{coverLetterInfo?.fullName}</p>
                </div>
            </div>
        </div>
    )
}

export default CoverLetterPreview
