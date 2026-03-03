import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { addCoverLetterData } from "@/features/coverLetter/coverLetterFeatures";
import { updateThisCoverLetter, getCoverLetterData } from "@/Services/coverLetterAPI";

function CoverLetterForm() {
    const { cover_letter_id } = useParams();
    const dispatch = useDispatch();
    const coverLetterInfo = useSelector((state) => state.editCoverLetter.coverLetterData);
    const [loading, setLoading] = useState(false);

    // Local state to manage form fields (optional, can rely on Redux if performance is fine)
    // Using direct Redux updates for simplicity and consistency with ResumeForm pattern

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Dispatch update to Redux store
        dispatch(addCoverLetterData({
            ...coverLetterInfo,
            [name]: value
        }));
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            data: {
                ...coverLetterInfo
            }
        };

        try {
            await updateThisCoverLetter(cover_letter_id, data);
            toast("Cover Letter Updated", "success");
        } catch (error) {
            toast(error.message, "error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Cover Letter Details</h2>
                <Link to="/dashboard">
                    <Button size="sm"><ArrowLeft /> Back</Button>
                </Link>
            </div>
            <p>Edit your cover letter details below.</p>

            <form onSubmit={onSave}>
                {/* Personal Details */}
                <h3 className="font-semibold mt-4 mb-2">Personal Details</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm">Full Name</label>
                        <Input name="fullName" defaultValue={coverLetterInfo?.fullName} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Job Title</label>
                        <Input name="jobTitle" defaultValue={coverLetterInfo?.jobTitle} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Address</label>
                        <Input name="address" defaultValue={coverLetterInfo?.address} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Phone</label>
                        <Input name="phone" defaultValue={coverLetterInfo?.phone} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Email</label>
                        <Input name="email" defaultValue={coverLetterInfo?.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">City</label>
                        <Input name="city" defaultValue={coverLetterInfo?.city} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">State</label>
                        <Input name="state" defaultValue={coverLetterInfo?.state} onChange={handleInputChange} />
                    </div>
                </div>

                {/* Recipient Details */}
                <h3 className="font-semibold mt-6 mb-2">Recipient Details</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm">Hiring Manager Name</label>
                        <Input name="hiringManager" defaultValue={coverLetterInfo?.hiringManager} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm">Company Name</label>
                        <Input name="companyName" defaultValue={coverLetterInfo?.companyName} onChange={handleInputChange} />
                    </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold mt-6 mb-2">Letter Content</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-sm">Summary</label>
                        <Textarea className="h-40" name="summary" defaultValue={coverLetterInfo?.summary} onChange={handleInputChange} />
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CoverLetterForm;
