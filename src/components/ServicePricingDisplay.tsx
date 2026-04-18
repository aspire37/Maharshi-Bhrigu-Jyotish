import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Star } from 'lucide-react';
import { SERVICE_PRICING } from '../constants';

export const ServicePricingDisplay: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-spiritual-cream/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-spiritual-gold/20 rounded-full mb-6 border border-spiritual-gold/30"
          >
            <Star className="w-4 h-4 text-spiritual-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-spiritual-gold">
              Transparent Pricing
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-spiritual-ink mb-4">
            Our Service Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your spiritual journey. All services include personalized guidance and lifetime support.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_PRICING.map((service) => (
            <motion.div
              key={service.serviceName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              onClick={() =>
                setSelectedService(
                  selectedService === service.serviceName ? null : service.serviceName
                )
              }
              className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            >
              {/* Service Header */}
              <div className="p-8 border-b border-gray-100">
                <h3 className="text-2xl font-serif font-bold text-spiritual-ink mb-2">
                  {service.serviceName}
                </h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>

              {/* Pricing Tiers */}
              <div className="p-8 space-y-6">
                {/* Basic Tier */}
                <div className="pb-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">Basic Session</span>
                    <span className="text-2xl font-bold text-spiritual-maroon">
                      ₹{service.basic}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-spiritual-gold" />
                      30-40 minute consultation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-spiritual-gold" />
                      Basic analysis
                    </li>
                  </ul>
                </div>

                {/* Premium Tier */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">Premium Session</span>
                    <span className="text-2xl font-bold text-spiritual-maroon">
                      ₹{service.premium}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-spiritual-gold" />
                      60-90 minute consultation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-spiritual-gold" />
                      In-depth analysis
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-spiritual-gold" />
                      Detailed report + remedies
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-spiritual-gold" />
                      Follow-up session included
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="p-8 border-t border-gray-100 bg-gray-50">
                <button className="w-full bg-spiritual-maroon text-white py-3 rounded-xl font-bold hover:bg-spiritual-maroon/90 transition-colors">
                  Book {service.serviceName}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 bg-white rounded-3xl border-2 border-gray-200 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-spiritual-maroon/10 to-spiritual-gold/10">
            <h3 className="text-2xl font-serif font-bold text-spiritual-ink">
              Service Comparison
            </h3>
            <p className="text-gray-600 mt-2">
              Compare features across all service tiers
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Basic</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">Duration</td>
                  <td className="px-6 py-4 text-center text-gray-600">30-40 min</td>
                  <td className="px-6 py-4 text-center text-gray-600">60-90 min</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">Personalized Analysis</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-spiritual-gold mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-spiritual-gold mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">Written Report</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-spiritual-gold mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">Remedies & Solutions</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-spiritual-gold mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">Follow-up Support</td>
                  <td className="px-6 py-4 text-center text-gray-400">—</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-5 h-5 text-spiritual-gold mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Discount Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 bg-gradient-to-r from-spiritual-maroon to-spiritual-gold rounded-3xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-serif font-bold mb-4">Special Offer</h3>
          <p className="text-lg mb-6 opacity-90">
            Use promo code <span className="font-bold">WELCOME20</span> for 20% off your first booking
          </p>
          <button className="bg-white text-spiritual-maroon px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
            Book Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};
