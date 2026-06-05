import React, { useState, useCallback } from 'react';
import {  m, AnimatePresence  } from 'framer-motion';
import Cropper from 'react-easy-crop';
import { Icon } from '@iconify/react';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 250;
  canvas.height = 250;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    250,
    250
  );

  return new Promise((resolve) => {
    resolve(canvas.toDataURL('image/jpeg', 0.8));
  });
};

const ReviewFormModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    company: '',
    review: ''
  });
  
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      setImageSrc(imageDataUrl);
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.review.length < 200) {
      setError('Review must be at least 200 characters long.');
      return;
    }
    
    if (step === 1 && !imageSrc) {
      document.getElementById('image-upload').click();
      return;
    }

    if (step === 2) {
      setIsSubmitting(true);
      setError('');
      try {
        const base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);

        const response = await fetch('/api/submit-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, imageUrl: base64Image })
        });

        const result = await response.json();
        
        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            setSuccess(false);
            setStep(1);
            setImageSrc(null);
            setFormData({ firstName: '', lastName: '', designation: '', company: '', review: '' });
          }, 3000);
        } else {
          setError(result.error || 'Failed to submit review.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <m.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          >
            <Icon icon="hugeicons:cancel-01" className="w-6 h-6" />
          </button>

          <div className="p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {success ? 'Thank You!' : (step === 1 ? 'Share Your Experience' : 'Adjust Your Profile Picture')}
            </h3>

            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Icon icon="hugeicons:tick-02" className="w-8 h-8" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">Your review has been submitted for approval. Karthik will review it shortly!</p>
              </div>
            ) : step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); document.getElementById('image-upload').click(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                    <input required type="text" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                    <input required type="text" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation *</label>
                    <input required type="text" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                    <input required type="text" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review (min 200 chars) *</label>
                  <textarea required minLength={200} rows="4" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white resize-none" value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} placeholder="Write about your experience working with me..."></textarea>
                  <div className="text-right text-xs text-gray-500 mt-1">{formData.review.length}/200</div>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
                
                <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  Next: Attach Your Photo <Icon icon="hugeicons:arrow-right-02" />
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-all">
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-70">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewFormModal;
