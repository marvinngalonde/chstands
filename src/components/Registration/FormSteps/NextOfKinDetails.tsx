import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Users, Calendar, MapPin, Phone, Briefcase } from 'lucide-react';

export const NextOfKinDetails: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-2" />
            First Name
          </label>
          <input
            {...register('nextOfKin.name')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter first name"
          />
          {errors.nextOfKin?.name && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nextOfKin.name.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-2" />
            Surname
          </label>
          <input
            {...register('nextOfKin.surname')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter surname"
          />
          {errors.nextOfKin?.surname && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nextOfKin.surname.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-2" />
            ID Number
          </label>
          <input
            {...register('nextOfKin.id_number')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter ID number"
          />
          {errors.nextOfKin?.id_number && (
            <p className="mt-1 text-sm text-red-600">{String(errors.nextOfKin.id_number.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Date of Birth
          </label>
          <input
            {...register('nextOfKin.dob')}
            type="date"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-2" />
            Relationship
          </label>
          <select
            {...register('nextOfKin.relation')}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select relationship</option>
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline w-4 h-4 mr-2" />
            Profession
          </label>
          <input
            {...register('nextOfKin.profession')}
            type="text"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter profession"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            Cell Number
          </label>
          <input
            {...register('nextOfKin.cell')}
            type="tel"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter cell number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-2" />
          Address
        </label>
        <textarea
          {...register('nextOfKin.address')}
          rows={3}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter full address"
        />
      </div>
    </div>
  );
};