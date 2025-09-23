import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign, CreditCard, Upload, AlertCircle } from 'lucide-react';

export const PaymentDetails: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const paymentMethod = watch('paymentDetails.paymentMethod');

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <DollarSign className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Payment Information</h3>
            <p className="text-sm text-green-700 mt-1">
              Review payment details and select your preferred payment method.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-green-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Payment Summary</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Monthly Installment:</span>
              <span className="text-lg font-semibold text-gray-900">$100 USD</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Administration Cost:</span>
              <span className="text-sm text-orange-600 font-medium">10% (non-refundable)</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Administration cost is calculated as 10% of the total contract value and is non-refundable.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Payment Method</h4>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                {...register('paymentDetails.paymentMethod')}
                type="radio"
                value="salary-deduction"
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Salary Deduction</div>
                <div className="text-xs text-gray-500">Automatic deduction from your salary</div>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                {...register('paymentDetails.paymentMethod')}
                type="radio"
                value="bank-transfer"
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Bank Transfer</div>
                <div className="text-xs text-gray-500">Transfer to council bank account</div>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                {...register('paymentDetails.paymentMethod')}
                type="radio"
                value="mobile-money"
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Mobile Money</div>
                <div className="text-xs text-gray-500">EcoCash, OneMoney, or Telecash</div>
              </div>
            </label>
          </div>
          
          {errors.paymentDetails?.paymentMethod && (
            <p className="mt-2 text-sm text-red-600">{String(errors.paymentDetails.paymentMethod.message)}</p>
          )}
        </div>
      </div>

      {(paymentMethod === 'bank-transfer' || paymentMethod === 'mobile-money') && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Upload className="h-6 w-6 text-purple-600 mr-2" />
            <h4 className="text-lg font-medium text-gray-900">Upload Proof of Payment</h4>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Receipt</h4>
            <p className="text-gray-600 mb-4">
              Upload a clear image or PDF of your payment receipt
            </p>
            <input
              {...register('paymentDetails.proofOfPayment')}
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Please ensure the receipt clearly shows the transaction date, amount, and reference number.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};