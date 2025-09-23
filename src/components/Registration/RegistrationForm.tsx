import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ProgressStepper } from './ProgressStepper';
import { ApplicantDetails } from './FormSteps/ApplicantDetails';
import { NextOfKinDetails } from './FormSteps/NextOfKinDetails';
import { SpouseDetails } from './FormSteps/SpouseDetails';
import { BeneficiaryDetails } from './FormSteps/BeneficiaryDetails';
import { AgreementDeclaration } from './FormSteps/AgreementDeclaration';
import { PaymentDetails } from './FormSteps/PaymentDetails';
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createApplication } from '../../api/applications';
import { createNextOfKin } from '../../api/nextofkin';
import { createSpouse } from '../../api/spouse';
import { createBeneficiary } from '../../api/beneficiaries';
import { Application, NextOfKin, Spouse, Beneficiary } from '../../types';

const schema = yup.object().shape({
  applicant: yup.object().shape({
    council_waiting_list_number: yup.string(),
    name: yup.string().required('Name is required'),
    surname: yup.string().required('Surname is required'),
    id_number: yup.string().required('ID number is required'),
    dob: yup.string().required('Date of birth is required'),
    residential_address: yup.string().required('Residential address is required'),
    contact_numbers: yup.string().required('Contact number is required'),
    employer: yup.string().required('Employer is required'),
    employer_contact: yup.string(),
    department: yup.string(),
    employment_number: yup.string()
  }),
  nextOfKin: yup.object().shape({
    name: yup.string().required('Next of kin name is required'),
    surname: yup.string().required('Next of kin surname is required'),
    id_number: yup.string().required('Next of kin ID number is required'),
    dob: yup.string().required('Next of kin date of birth is required'),
    relation: yup.string().required('Relationship is required'),
    profession: yup.string().nullable(),
    address: yup.string().nullable(),
    cell: yup.string().nullable()
  }),
  spouse: yup.object().shape({
    name: yup.string().nullable(),
    surname: yup.string().nullable(),
    id_number: yup.string().nullable(),
    dob: yup.string().nullable()
  }),
  beneficiaries: yup.array().of(
    yup.object().shape({
      name: yup.string().nullable(),
      dob: yup.string().nullable(),
      id_number: yup.string().nullable()
    })
  ),
  digitalSignature: yup.string().nullable(),
  paymentDetails: yup.object().shape({
    paymentMethod: yup.string().nullable()
  })
});

const stepLabels = [
  'Applicant Details',
  'Next of Kin',
  'Spouse Details',
  'Beneficiaries',
  'Agreement',
  'Payment'
];

export const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      applicant: {
        employer: 'City of Harare',
        contact_numbers: '',
        council_waiting_list_number: '',
        name: '',
        surname: '',
        id_number: '',
        dob: '',
        residential_address: '',
        department: '',
        employment_number: '',
        employer_contact: ''
      },
      nextOfKin: {
        name: '',
        surname: '',
        id_number: '',
        dob: '',
        relation: '',
        profession: '',
        address: '',
        cell: ''
      },
      spouse: {
        name: '',
        surname: '',
        id_number: '',
        dob: ''
      },
      beneficiaries: [{ name: '', dob: '', id_number: '' }],
      paymentDetails: {
        monthlyInstallment: 100,
        administrationCost: '10% (non-refundable)'
      },
      digitalSignature: '',
      agreementDate: new Date().toISOString().split('T')[0]
    }
  });

  // Auto-save functionality
  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem('applicationDraft', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('applicationDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        methods.reset(parsedDraft);
      } catch (error) {
        console.error('Failed to load saved draft:', error);
      }
    }
  }, [methods]);

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['applicant'];
        break;
      case 2:
        fieldsToValidate = ['nextOfKin'];
        break;
      case 3:
        fieldsToValidate = ['spouse'];
        break;
      case 4:
        fieldsToValidate = ['beneficiaries'];
        break;
      case 5:
        fieldsToValidate = []; // Skip digital signature validation for now
        break;
      case 6:
        fieldsToValidate = []; // Skip payment validation for now
        break;
    }

    const isValid = await methods.trigger(fieldsToValidate);
    if (isValid && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createApplicationMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!token) throw new Error('No authentication token');

      // Create the main application
      const applicationData: Omit<Application, 'id' | 'user_id' | 'status' | 'created_at'> = {
        council_waiting_list_number: data.applicant.council_waiting_list_number || '',
        name: data.applicant.name,
        surname: data.applicant.surname,
        id_number: data.applicant.id_number,
        dob: data.applicant.dob,
        residential_address: data.applicant.residential_address,
        contact_numbers: data.applicant.contact_numbers,
        employer: data.applicant.employer,
        department: data.applicant.department || '',
        employment_number: data.applicant.employment_number || '',
        employer_contact: data.applicant.employer_contact || ''
      };

      const application = await createApplication(applicationData, token);

      // Create next of kin if provided
      if (data.nextOfKin && data.nextOfKin.name) {
        const nextOfKinData: Omit<NextOfKin, 'id' | 'application_id'> = {
          name: data.nextOfKin.name,
          surname: data.nextOfKin.surname,
          id_number: data.nextOfKin.id_number,
          dob: data.nextOfKin.dob,
          relation: data.nextOfKin.relation,
          profession: data.nextOfKin.profession || '',
          address: data.nextOfKin.address || '',
          cell: data.nextOfKin.cell || ''
        };
        await createNextOfKin(application.id!, nextOfKinData, token);
      }

      // Create spouse if provided
      if (data.spouse && data.spouse.name) {
        const spouseData: Omit<Spouse, 'id' | 'application_id'> = {
          name: data.spouse.name,
          surname: data.spouse.surname,
          id_number: data.spouse.id_number,
          dob: data.spouse.dob
        };
        await createSpouse(application.id!, spouseData, token);
      }

      // Create beneficiaries if provided
      if (data.beneficiaries && data.beneficiaries.length > 0) {
        for (const beneficiary of data.beneficiaries) {
          if (beneficiary.name) {
            const beneficiaryData: Omit<Beneficiary, 'id' | 'application_id'> = {
              name: beneficiary.name,
              dob: beneficiary.dob,
              id_number: beneficiary.id_number
            };
            await createBeneficiary(application.id!, beneficiaryData, token);
          }
        }
      }

      return application;
    },
    onSuccess: () => {
      // Clear saved draft
      localStorage.removeItem('applicationDraft');

      // Invalidate applications query to refresh data
      queryClient.invalidateQueries({ queryKey: ['applications'] });

      toast.success('Application submitted successfully!');
      navigate('/status');
    },
    onError: (error: any) => {
      console.error('Submission failed:', error);
      toast.error(error.message || 'Failed to submit application');
    }
  });

  const onSubmit = async (data: any) => {
    createApplicationMutation.mutate(data);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ApplicantDetails />;
      case 2:
        return <NextOfKinDetails />;
      case 3:
        return <SpouseDetails />;
      case 4:
        return <BeneficiaryDetails />;
      case 5:
        return <AgreementDeclaration />;
      case 6:
        return <PaymentDetails />;
      default:
        return <ApplicantDetails />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Stand Registration Application</h1>
          <p className="text-gray-600 mt-2">
            Complete all sections to register for a stand. Your progress is automatically saved.
          </p>
        </div>

        <div className="px-8 py-6">
          <ProgressStepper
            currentStep={currentStep}
            totalSteps={6}
            stepLabels={stepLabels}
          />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="px-8 py-6 min-h-[500px]">
              {renderCurrentStep()}
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    const currentData = methods.getValues();
                    localStorage.setItem('applicationDraft', JSON.stringify(currentData));
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={createApplicationMutation.isPending}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {createApplicationMutation.isPending ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {createApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};