import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, Calendar, User, PenTool } from 'lucide-react';

export const AgreementDeclaration: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [isDrawing, setIsDrawing] = useState(false);
  
  const applicantName = watch('applicant.name');
  const applicantSurname = watch('applicant.surname');
  const fullName = `${applicantName || '[Name]'} ${applicantSurname || '[Surname]'}`;

  const agreementText = `I, ${fullName}, the undersigned, do hereby state that I shall abide by the terms and conditions of this contract as set out by the City of Harare. I understand that any breach of these terms may result in the termination of this agreement and forfeiture of any payments made. I declare that all information provided in this application is true and accurate to the best of my knowledge.

I further acknowledge that:
1. The monthly installment payment is mandatory and must be paid on time
2. The administration cost is non-refundable
3. The City of Harare reserves the right to review and modify terms as necessary
4. Any disputes will be handled according to the City of Harare's dispute resolution procedures

I agree to these terms and conditions and commit to fulfilling all obligations under this agreement.`;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <FileText className="h-5 w-5 text-amber-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Agreement & Declaration</h3>
            <p className="text-sm text-amber-700 mt-1">
              Please read the agreement carefully and provide your digital signature.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Terms and Conditions</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {agreementText}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Full Name (Auto-filled)
          </label>
          <input
            {...register('agreementFullName')}
            type="text"
            value={fullName}
            onChange={(e) => setValue('agreementFullName', e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Date
          </label>
          <input
            {...register('agreementDate')}
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <PenTool className="inline w-4 h-4 mr-2" />
          Digital Signature
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <PenTool className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Digital Signature Required</h4>
          <p className="text-gray-600 mb-4">
            In a real implementation, this would include a signature pad for digital signatures.
          </p>
          <input
            {...register('digitalSignature')}
            type="text"
            placeholder="Type your full name as digital signature"
            className="block w-full max-w-md mx-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        {errors.digitalSignature && (
          <p className="mt-1 text-sm text-red-600">{String(errors.digitalSignature.message)}</p>
        )}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-red-800 mb-2">Important Notice</h4>
        <p className="text-sm text-red-700">
          By providing your digital signature above, you acknowledge that you have read, 
          understood, and agree to be bound by all the terms and conditions outlined in this agreement.
        </p>
      </div>
    </div>
  );
};