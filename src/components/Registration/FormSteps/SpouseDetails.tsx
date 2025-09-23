import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Heart, Calendar, User } from 'lucide-react';

export const SpouseDetails: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <Heart className="h-5 w-5 text-pink-400 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-pink-800">Spouse Information</h3>
            <p className="text-sm text-pink-700 mt-1">
              Please provide details about your spouse if applicable.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            First Name
          </label>
          <input
            {...register('spouse.name')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter spouse's first name"
          />
          {errors.spouse?.name && (
            <p className="mt-1 text-sm text-red-600">{String(errors.spouse.name.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Surname
          </label>
          <input
            {...register('spouse.surname')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter spouse's surname"
          />
          {errors.spouse?.surname && (
            <p className="mt-1 text-sm text-red-600">{String(errors.spouse.surname.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            ID Number
          </label>
          <input
            {...register('spouse.id_number')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter spouse's ID number"
          />
          {errors.spouse?.id_number && (
            <p className="mt-1 text-sm text-red-600">{String(errors.spouse.id_number.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Date of Birth
          </label>
          <input
            {...register('spouse.dob')}
            type="date"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.spouse?.dob && (
            <p className="mt-1 text-sm text-red-600">{String(errors.spouse.dob.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
};