import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreditCard, DollarSign, Receipt, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createPayment } from '../../api/payments';
import { Payment } from '../../types';

const schema = yup.object().shape({
  amount: yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0'),
  currency: yup.string().required('Currency is required'),
  description: yup.string().required('Description is required'),
  receipt_number: yup.string().required('Receipt number is required'),
});

interface PaymentFormProps {
  applicationId: number;
  onPaymentCreated?: (payment: Payment) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  applicationId,
  onPaymentCreated
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
      currency: 'USD',
      description: '',
      receipt_number: ''
    }
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: Omit<Payment, 'id' | 'application_id' | 'created_at'>) => {
      if (!token) throw new Error('No authentication token');
      return createPayment(applicationId, data, token);
    },
    onSuccess: (payment: Payment) => {
      toast.success('Payment recorded successfully!');
      reset();
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      onPaymentCreated?.(payment);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record payment');
    }
  });

  const onSubmit = (data: any) => {
    createPaymentMutation.mutate({
      amount: parseFloat(data.amount),
      currency: data.currency,
      description: data.description,
      receipt_number: data.receipt_number
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Record Payment
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={createPaymentMutation.isPending}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <select
              {...register('currency')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.currency ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={createPaymentMutation.isPending}
            >
              <option value="USD">USD ($)</option>
              <option value="ZWL">ZWL (ZW$)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
            )}
          </div>
        </div>

        {/* Receipt Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Receipt Number *
          </label>
          <div className="relative">
            <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...register('receipt_number')}
              type="text"
              placeholder="e.g., REC-2024-001"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.receipt_number ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={createPaymentMutation.isPending}
            />
          </div>
          {errors.receipt_number && (
            <p className="mt-1 text-sm text-red-600">{errors.receipt_number.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Payment description (e.g., Monthly stand fee for January 2024)"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={createPaymentMutation.isPending}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createPaymentMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {createPaymentMutation.isPending ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Recording Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Record Payment
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            disabled={createPaymentMutation.isPending}
            className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};