import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Users, Calendar, User, Plus, Trash2 } from 'lucide-react';

export const BeneficiaryDetails: React.FC = () => {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'beneficiaries'
  });

  const addBeneficiary = () => {
    append({
      name: '',
      dob: '',
      id_number: ''
    });
  };

  const removeBeneficiary = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <Users className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Beneficiary Information</h3>
            <p className="text-sm text-blue-700 mt-1">
              Add people who will benefit from your stand registration.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            {...register('isNextOfKinBeneficiary')}
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">
            Include Next of Kin as a beneficiary
          </span>
        </label>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-700">
                Beneficiary {index + 1}
              </h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBeneficiary(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  {...register(`beneficiaries.${index}.name`)}
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date of Birth
                </label>
                <input
                  {...register(`beneficiaries.${index}.dob`)}
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  ID Number
                </label>
                <input
                  {...register(`beneficiaries.${index}.id_number`)}
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter ID number"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addBeneficiary}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Beneficiary
      </button>
    </div>
  );
};