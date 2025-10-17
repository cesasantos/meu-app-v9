import React from 'react';
import Modal from './Modal';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysesCount: number;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, analysesCount }) => {
    const { t } = useLanguage();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('profileTitle')}>
            <div className="text-center p-4">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('profileWelcome')}</h3>
                
                <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg inline-block mb-6">
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('analysesRun')}</div>
                    <div className="text-4xl font-bold text-green-500">{analysesCount}</div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-6">{t('profileInfo')}</p>

                 <button 
                    onClick={onClose} 
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
                >
                    {t('closeButton')}
                </button>
            </div>
        </Modal>
    );
};

export default ProfileModal;