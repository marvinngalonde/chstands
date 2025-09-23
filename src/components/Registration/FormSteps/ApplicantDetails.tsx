import React from 'react';
import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone, Building, Calendar, MapPin, Briefcase } from 'lucide-react';

export const ApplicantDetails: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Council Waiting List Number
          </label>
          <input
            {...register('applicant.council_waiting_list_number')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter waiting list number"
          />
          {errors.applicant?.council_waiting_list_number && (
            <p className="mt-1 text-sm text-red-600">{String(errors.applicant.council_waiting_list_number.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            First Name
          </label>
          <input
            {...register('applicant.name')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter first name"
          />
          {errors.applicant?.name && (
            <p className="mt-1 text-sm text-red-600">{String(errors.applicant.name.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Surname
          </label>
          <input
            {...register('applicant.surname')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter surname"
          />
          {errors.applicant?.surname && (
            <p className="mt-1 text-sm text-red-600">{String(errors.applicant.surname.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            ID Number
          </label>
          <input
            {...register('applicant.id_number')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter ID number"
          />
          {errors.applicant?.id_number && (
            <p className="mt-1 text-sm text-red-600">{String(errors.applicant.id_number.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Date of Birth
          </label>
          <input
            {...register('applicant.dob')}
            type="date"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.applicant?.dob && (
            <p className="mt-1 text-sm text-red-600">{String(errors.applicant.dob.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Contact Number
          </label>
          <input
            {...register('applicant.contact_numbers')}
            type="tel"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter contact number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-2" />
          Residential Address
        </label>
        <textarea
          {...register('applicant.residential_address')}
          rows={3}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter full residential address"
        />
        {errors.applicant?.residential_address && (
          <p className="mt-1 text-sm text-red-600">{String(errors.applicant.residential_address.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline w-4 h-4 mr-2" />
            Employer
          </label>
          <input
            {...register('applicant.employer')}
            type="text"
            defaultValue="City of Harare"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Employer Contact
          </label>
          <input
            {...register('applicant.employer_contact')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter employer contact"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline w-4 h-4 mr-2" />
            Department
          </label>
          <input
            {...register('applicant.department')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter department"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-2" />
            Employment Number
          </label>
          <input
            {...register('applicant.employment_number')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter employment number"
          />
        </div>
      </div>
    </div>
  );
};