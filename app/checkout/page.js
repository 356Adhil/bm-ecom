'use client';
import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, Check, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { AuthModal } from '../components/layout/AuthModal';

export default function CheckoutPage() {
  const { status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { cart } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phone: '',
    },
    payment: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      setShowAuthModal(true);
    }
  }, [status]);

  const [errors, setErrors] = useState({
    shipping: {},
    payment: {},
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const validateShippingForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, address, city, postalCode, phone } = formData.shipping;

    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!postalCode) newErrors.postalCode = 'Postal code is required';
    if (!phone) newErrors.phone = 'Phone number is required';

    setErrors({ ...errors, shipping: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};
    const { cardNumber, cardHolder, expiryDate, cvv } = formData.payment;

    if (!cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!cardHolder) newErrors.cardHolder = 'Card holder name is required';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!cvv) newErrors.cvv = 'CVV is required';

    setErrors({ ...errors, payment: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: '',
      },
    }));
  };

  const handleNext = () => {
    let isValid = false;

    if (step === 1) {
      isValid = validateShippingForm();
    } else if (step === 2) {
      isValid = validatePaymentForm();
    }

    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      router.push('/cart');
    }
  };

  // const handleSubmitOrder = async () => {
  //   try {
  //     setLoading(true);
  //     // Here you would typically:
  //     // 1. Process payment
  //     // 2. Create order in database
  //     // 3. Clear cart
  //     // 4. Send confirmation email
  //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
  //     router.push('/order-success');
  //   } catch (error) {
  //     console.error('Error processing order:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmitOrder = async () => {
    if (status !== 'authenticated') {
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);

      // Example API call with auth
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          shipping: formData.shipping,
          payment: formData.payment,
          total,
        }),
      });

      if (!response.ok) throw new Error('Order failed');

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/order-success');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCurrentStepValid = () => {
    if (step === 1) {
      const { firstName, lastName, email, address, city, postalCode, phone } = formData.shipping;
      return firstName && lastName && email && address && city && postalCode && phone;
    }
    if (step === 2) {
      const { cardNumber, cardHolder, expiryDate, cvv } = formData.payment;
      return cardNumber && cardHolder && expiryDate && cvv;
    }
    return true;
  };

  const renderInput = (section, field, placeholder, type = 'text') => (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-lg ${
          errors[section][field] ? 'border-red-500' : 'border-zinc-200'
        }`}
        value={formData[section][field]}
        onChange={(e) => handleInputChange(section, field, e.target.value)}
        required
      />
      {errors[section][field] && (
        <p className="text-red-500 text-sm mt-1">{errors[section][field]}</p>
      )}
    </div>
  );

  // Add before your return statement:
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-zinc-50">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 bg-white md:hidden">
          <div className="flex items-center h-16 px-4 border-b">
            <button onClick={handleBack} className="p-2 -ml-2">
              <ArrowLeft size={20} />
            </button>
            <span className="flex-1 text-center font-medium">
              {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Confirmation'}
            </span>
          </div>

          {/* Mobile Progress Bar */}
          <div className="h-1 bg-zinc-100">
            <div
              className="h-full bg-zinc-900 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block p-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 mb-4"
            >
              <ArrowLeft size={20} />
              {step > 1 ? 'Back' : 'Back to Cart'}
            </button>

            <div className="flex items-center justify-between mb-8">
              <div className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-zinc-900 text-white' : 'bg-zinc-200'
                  }`}
                >
                  <Truck size={16} />
                </div>
                <div className={`flex-1 h-1 ${step >= 2 ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
              </div>
              <div className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-200'
                  }`}
                >
                  <CreditCard size={16} />
                </div>
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-zinc-900 text-white' : 'bg-zinc-200'
                }`}
              >
                <Check size={16} />
              </div>
            </div>
          </div>
        </div>

        <main className="md:p-4 md:max-w-4xl md:mx-auto pb-32 md:pb-24">
          <div className="md:flex md:gap-8">
            {/* Form Section */}
            <div className="flex-1">
              <div className="bg-white md:p-6 md:rounded-xl">
                <div className="p-4 md:p-0">
                  {step === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold mb-6 hidden md:block">
                        Shipping Information
                      </h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {renderInput('shipping', 'firstName', 'First Name')}
                          {renderInput('shipping', 'lastName', 'Last Name')}
                        </div>
                        {renderInput('shipping', 'email', 'Email', 'email')}
                        {renderInput('shipping', 'address', 'Address')}
                        <div className="grid grid-cols-2 gap-4">
                          {renderInput('shipping', 'city', 'City')}
                          {renderInput('shipping', 'postalCode', 'Postal Code')}
                        </div>
                        {renderInput('shipping', 'phone', 'Phone', 'tel')}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold mb-6 hidden md:block">
                        Payment Information
                      </h2>
                      {renderInput('payment', 'cardNumber', 'Card Number')}
                      {renderInput('payment', 'cardHolder', 'Card Holder Name')}
                      <div className="grid grid-cols-2 gap-4">
                        {renderInput('payment', 'expiryDate', 'MM/YY')}
                        {renderInput('payment', 'cvv', 'CVV')}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold mb-6 hidden md:block">Order Confirmation</h2>
                      <div className="space-y-4">
                        <div className="bg-zinc-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Shipping Details</h3>
                          <p>
                            {formData.shipping.firstName} {formData.shipping.lastName}
                          </p>
                          <p>{formData.shipping.address}</p>
                          <p>
                            {formData.shipping.city}, {formData.shipping.postalCode}
                          </p>
                          <p>{formData.shipping.phone}</p>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Payment Method</h3>
                          <p>Card ending in {formData.payment.cardNumber.slice(-4)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Order Summary */}
            <div className="hidden md:block w-80">
              <div className="bg-white p-6 rounded-xl">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-zinc-100 rounded-lg relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
          {/* Order Summary Toggle */}
          <div className="border-b">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center justify-between w-full p-4 text-left"
            >
              <span className="font-medium">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium">${total.toFixed(2)}</span>
                <ChevronUp
                  size={20}
                  className={`transform transition-transform ${showSummary ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Order Summary */}
          {showSummary && (
            <div className="p-4 border-b bg-zinc-50 space-y-4 max-h-[40vh] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-100 rounded-lg relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Action Buttons */}
          <div className="p-4 bg-white space-y-3">
            {step === 3 ? (
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full py-4 bg-zinc-900 text-white rounded-xl font-medium disabled:bg-zinc-300 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Place Order'
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className="w-full py-4 bg-zinc-900 text-white rounded-xl font-medium disabled:bg-zinc-300"
                >
                  Continue to {step === 1 ? 'Payment' : 'Confirmation'}
                </button>
                <button
                  onClick={handleBack}
                  className="w-full py-4 bg-white text-zinc-900 rounded-xl font-medium border border-zinc-200"
                >
                  Back to {step === 1 ? 'Cart' : step === 2 ? 'Shipping' : 'Payment'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="max-w-4xl mx-auto p-4 flex justify-end gap-4">
            <button
              onClick={handleBack}
              className="px-8 py-4 bg-white text-zinc-900 rounded-xl font-medium border border-zinc-200"
            >
              Back
            </button>
            {step === 3 ? (
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-medium disabled:bg-zinc-300 min-w-[160px] flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Place Order'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-medium disabled:bg-zinc-300"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          if (status === 'unauthenticated') {
            router.push('/cart');
          }
        }}
      />
    </>
  );
}
