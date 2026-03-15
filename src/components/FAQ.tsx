import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQComponent: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleCategory = (title: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedCategories(newExpanded);
  };

  const faqData: FAQCategory[] = [
    {
      title: "💳 Refund & Cancellation Policy",
      icon: "💳",
      items: [
        {
          id: "refund-1",
          question: "Why are your services non-refundable?",
          answer: "Vedic astrology consultations and reports require significant time, energy, and preparation, including in-depth analysis of your birth chart before the actual meeting. Once a booking is confirmed, our resources are dedicated to your session, making it impossible to offer refunds."
        },
        {
          id: "refund-2",
          question: "Can I cancel my booking and get a refund?",
          answer: "No. Once a consultation is booked and payment is made, cancellations are not eligible for a refund. However, we do offer rescheduling options in most cases."
        },
        {
          id: "refund-3",
          question: "What if I need to reschedule my session?",
          answer: "We understand that scheduling conflicts occur. You may reschedule your appointment by informing us at least 24–48 hours in advance. Rescheduling within 24 hours of the appointment may not be permitted or may incur a fee."
        },
        {
          id: "refund-4",
          question: "What happens if I miss my appointment?",
          answer: "Missed appointments (no-shows) are considered consumed services and are non-refundable. Please ensure you're available at the scheduled time or reschedule in advance."
        },
        {
          id: "refund-5",
          question: "Under what circumstances can I get a refund?",
          answer: "Refunds are only considered in exceptional, rare cases, such as: (1) A technical error on our side prevented service delivery, (2) Duplicate payments were made for the same service, or (3) The booking was canceled within 1 hour of booking AND work had not yet begun (at our discretion)."
        }
      ]
    },
    {
      title: "📋 Service & Delivery",
      icon: "📋",
      items: [
        {
          id: "service-1",
          question: "What if I am not satisfied with the reading?",
          answer: "Astrology is a guidance service based on planetary positions and interpretations. While we ensure quality analysis, we do not provide refunds due to dissatisfaction with the predictions, change of mind, or if personal predictions do not manifest as expected."
        },
        {
          id: "service-2",
          question: "What happens if I provide wrong birth details?",
          answer: "If incorrect birth details (date, time, place) are submitted, the resulting report will be inaccurate. We strongly recommend verifying your birth certificate. No refunds or free re-calculations will be provided for mistakes made by the user, but you can pay for a corrected analysis if needed."
        },
        {
          id: "service-3",
          question: "When will I receive my written report?",
          answer: "Reports are typically delivered within 5-7 working days from the session date. As these are personalized and detailed analyses, the turnaround time is maintained strictly. You'll receive a confirmation email once your report is ready."
        },
        {
          id: "service-4",
          question: "Can I request a follow-up consultation?",
          answer: "Absolutely! Many clients book follow-up sessions to dive deeper into specific life areas or to check on predictions as time progresses. Follow-up sessions can be scheduled at any time and are treated as new bookings."
        },
        {
          id: "service-5",
          question: "Do you offer personalized dietary or lifestyle recommendations?",
          answer: "Yes, our consultations and reports often include personalized recommendations based on your astrological chart, including gemstone suggestions, meditation practices, and lifestyle adjustments aligned with your planetary influences."
        }
      ]
    },
    {
      title: "💰 Payment & Procedures",
      icon: "💰",
      items: [
        {
          id: "payment-1",
          question: "What is the process for a valid refund?",
          answer: "If a refund is approved, it will be processed within 5–7 business days and credited back to the original payment source. You will receive a confirmation email with the refund details and transaction reference number."
        },
        {
          id: "payment-2",
          question: "How can I submit a complaint or refund request?",
          answer: "You may email our support team with your order number and a detailed explanation. Please note that requests must be submitted within 3 days of service delivery to be considered."
        },
        {
          id: "payment-3",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payment methods including UPI and netbanking. Your payment information is secured with SSL encryption."
        },
        {
          id: "payment-4",
          question: "Is my payment information secure?",
          answer: "Yes, absolutely. We use industry-standard security protocols and encrypted payment gateways. Your personal and financial information is never shared with third parties."
        },
        {
          id: "payment-5",
          question: "Do you offer payment plans for services?",
          answer: "Payment plans may be available for certain premium packages. Please contact our support team to discuss custom payment arrangements for your specific needs."
        }
      ]
    },
    {
      title: "⭐ Vedic Astrology",
      icon: "⭐",
      items: [
        {
          id: "vedic-1",
          question: "What is Vedic Astrology (Jyotish)?",
          answer: "Vedic Astrology, or Jyotish, is an ancient Indian system of astrology based on the Vedas and Upanishads. It uses the sidereal zodiac and studies the positions of celestial bodies relative to constellations (nakshatras) to understand personality, life events, and spiritual growth. Unlike Western astrology, it's highly mathematical and precise."
        },
        {
          id: "vedic-2",
          question: "How accurate is Vedic astrology?",
          answer: "Vedic astrology has been refined over thousands of years and has a remarkable track record. Its accuracy depends on: (1) Precise birth time and location, (2) The expertise of the astrologer, and (3) Understanding that astrology shows tendencies and potential, not absolute certainties. With correct birth details and a skilled astrologer, accuracy rates can be very high."
        },
        {
          id: "vedic-3",
          question: "What's the difference between Western and Vedic astrology?",
          answer: "Western astrology uses the tropical zodiac (based on seasons), while Vedic astrology uses the sidereal zodiac (based on actual star positions). Vedic astrology also incorporates nakshatras (lunar mansions), dashas (planetary periods), and more detailed predictive techniques. Both are valid systems but approach interpretation differently."
        },
        {
          id: "vedic-4",
          question: "Do you provide compatibility/matchmaking readings?",
          answer: "Yes! We offer detailed Guna Milap (compatibility analysis) and Synastry readings for couples. These examine aspects like Venus placement, Mars position, Moon signs, and other planetary combinations to assess relationship potential, marriage compatibility, and life partnership harmony."
        },
        {
          id: "vedic-5",
          question: "What information do you need for a birth chart analysis?",
          answer: "We need: (1) Your exact birth date (day, month, year), (2) Precise birth time (hour, minute), and (3) Birth location (city and country). The more accurate your birth time, the more precise your chart analysis will be. If you don't know your exact time, we can help estimate it."
        },
        {
          id: "vedic-6",
          question: "How do planetary periods (Dashas) work?",
          answer: "Dashas are planetary time periods that govern different phases of your life, typically lasting several years each. Each dasha brings the influence of a particular planet, explaining life trends, opportunities, and challenges during that period. Understanding your current dasha helps in planning major life decisions."
        },
        {
          id: "vedic-7",
          question: "What are Nakshatras and why are they important?",
          answer: "Nakshatras are 27 lunar mansions or star clusters in the zodiac. Your birth nakshatra reveals your core nature, talents, and life purpose. Nakshatras are crucial for matching, naming children, choosing auspicious dates, and understanding deeper personality aspects beyond just your sun sign."
        },
        {
          id: "vedic-8",
          question: "Can astrology predict my future accurately?",
          answer: "Astrology shows probable timelines and life themes, not absolute certainties. Your actions, choices, and intentions significantly influence outcomes (karma). Astrology helps you understand energetic patterns and make better decisions, but you retain free will and the power to shape your destiny."
        }
      ]
    },
    {
      title: "🔄 Past Life Regression (PLR)",
      icon: "🔄",
      items: [
        {
          id: "plr-1",
          question: "How does Past Life Regression work?",
          answer: "PLR is a guided meditation technique that helps you access memories from previous lifetimes. Through deep relaxation and focused visualization, your subconscious mind recalls past-life experiences. This isn't about entertainment—it's a therapeutic tool used to understand current life patterns, fears, relationships, and spiritual growth."
        },
        {
          id: "plr-2",
          question: "Is Past Life Regression scientifically proven?",
          answer: "PLR is explored by psychologists, therapists, and researchers in meditation and hypnotherapy. While scientific institutions continue studying past-life experiences, many clients report significant emotional healing, resolved phobias, and clarity about life purpose after PLR sessions. We recommend viewing it as a powerful therapeutic and spiritual tool for personal growth."
        },
        {
          id: "plr-3",
          question: "What should I expect during a PLR session?",
          answer: "A typical PLR session begins with relaxation techniques, progresses to guided visualization, and helps you access past-life memories. You'll remain conscious throughout and can speak during the experience. Sessions last 60-90 minutes. Most people report vivid imagery, emotions, and insights. Some may experience physical sensations related to past-life events."
        },
        {
          id: "plr-4",
          question: "Can PLR help me understand current life issues?",
          answer: "Absolutely. Many current fears, relationship patterns, and life challenges have roots in past-life experiences. PLR can help you understand 'why' you're drawn to certain people or situations, why you have unexplained phobias, or why you're repeating patterns. This understanding often leads to healing and personal transformation."
        },
        {
          id: "plr-5",
          question: "Is PLR similar to meditation or hypnotherapy?",
          answer: "PLR combines elements of both but is unique. Unlike meditation (which focuses on present awareness), PLR guides you into the past. Unlike clinical hypnotherapy (which treats specific conditions), PLR explores entire lifetimes for spiritual growth and understanding. It's a spiritual-therapeutic hybrid."
        },
        {
          id: "plr-6",
          question: "Will PLR change my beliefs about reincarnation?",
          answer: "PLR can deepen spiritual understanding and awareness, but it's presented as an exploration tool, not dogma. Whether you interpret past-life memories as literal rebirths or as symbolic representations of your subconscious, the therapeutic benefits—resolution, clarity, and healing—remain valid and meaningful."
        },
        {
          id: "plr-7",
          question: "How many PLR sessions do I need?",
          answer: "This varies by individual. Some people have profound breakthroughs in one session, while others benefit from 2-4 sessions to explore different lifetimes or issues. We recommend discussing your goals with us, and we'll suggest a suitable number of sessions for optimal results."
        }
      ]
    },
    {
      title: "💎 Healing & Crystal Therapy",
      icon: "💎",
      items: [
        {
          id: "healing-1",
          question: "What types of healing services do you offer?",
          answer: "We offer multiple healing modalities: (1) Crystal healing and chakra balancing, (2) Energy healing aligned with Vedic principles, (3) Sound healing and mantra therapy, (4) Chakra cleansing and realignment, and (5) Personalized healing recommendations based on your astrological chart. All are complementary therapy practices."
        },
        {
          id: "healing-2",
          question: "How do crystals help in healing?",
          answer: "Crystals are believed to have vibrational frequencies that align with different energy states. When placed on or near your body, certain crystals can help balance chakras, promote emotional release, enhance meditation, and restore energetic harmony. Different crystals correspond to different intentions (rose quartz for love, amethyst for clarity, etc.)."
        },
        {
          id: "healing-3",
          question: "What's chakra balancing and why is it important?",
          answer: "Chakras are energy centers in your body. When blocked or imbalanced, they can cause physical discomfort, emotional issues, and mental confusion. Chakra balancing uses crystals, sound, visualization, and energy work to clear blockages and restore healthy energy flow, promoting overall wellness and spiritual alignment."
        },
        {
          id: "healing-4",
          question: "Is crystal healing scientifically backed?",
          answer: "While crystal healing is considered complementary therapy and not a replacement for medical treatment, many people report genuine benefits including stress relief, improved sleep, emotional balance, and spiritual clarity. Research on the specific mechanisms is ongoing, but user testimonials and metaphysical practices spanning centuries validate its effectiveness for many."
        },
        {
          id: "healing-5",
          question: "Can I use crystals alongside medical treatment?",
          answer: "Yes, crystals complement medical treatment beautifully. They can support emotional and spiritual healing during medical recovery. However, crystals are NOT a substitute for professional medical care. Always consult your doctor for health concerns. We recommend using crystals as supportive, holistic tools for comprehensive wellness."
        },
        {
          id: "healing-6",
          question: "Why are certain crystals recommended for me?",
          answer: "Recommendations depend on your astrological chart (planetary positions and their associated gemstones), your chakras' current state, your emotional/spiritual goals, and identified energy blockages. Some crystals are recommended as birthstones; others are chosen based on your specific intentions and imbalances."
        },
        {
          id: "healing-7",
          question: "How should I care for my crystals?",
          answer: "Crystals absorb energy and should be cleansed regularly. Methods include: (1) Moonlight exposure (overnight under full moon), (2) Saltwater or salt burial (24 hours), (3) Sage or palo santo smudging, (4) Sound cleansing (bells or singing bowls), or (5) Sunlight exposure (for some crystals). Program your crystals with intention after cleansing."
        },
        {
          id: "healing-8",
          question: "What's the difference between birthstones and therapeutic crystals?",
          answer: "Birthstones are traditionally associated with your birth month and carry planetary influences. Therapeutic crystals are chosen for specific healing properties and emotional needs. A crystal can be both your birthstone and a therapeutic choice, or you might use different crystals for different purposes based on your current intentions."
        }
      ]
    },
    {
      title: "🏠 Vastu Shastra",
      icon: "🏠",
      items: [
        {
          id: "vastu-1",
          question: "What is Vastu Shastra?",
          answer: "Vastu Shastra is an ancient Indian science of architecture and spatial design that harmonizes buildings with natural forces and cosmic energies. Dating back thousands of years, it provides principles for arranging spaces, directions, and elements to promote health, prosperity, peace, and positive flow of energy in homes, offices, and temples."
        },
        {
          id: "vastu-2",
          question: "How does Vastu differ from Feng Shui?",
          answer: "Both are space-harmony systems, but Vastu is Indian/Vedic while Feng Shui is Chinese. Vastu emphasizes cardinal directions, the five elements (earth, water, fire, air, space), and cosmic principles. Feng Shui focuses on chi flow and yin-yang balance. Both aim to optimize spatial energy, but use different frameworks and remedies."
        },
        {
          id: "vastu-3",
          question: "Can Vastu changes improve my life?",
          answer: "Absolutely. Many people report improvements in health, relationships, finances, and overall well-being after Vastu corrections. However, Vastu works alongside your actions and karma. It removes energetic obstacles but doesn't replace hard work, right decisions, and intention. Think of it as creating favorable conditions for success."
        },
        {
          id: "vastu-4",
          question: "Do I need to renovate my entire house for Vastu?",
          answer: "No! Major renovations aren't necessary. Simple, cost-effective adjustments often yield significant results: repositioning furniture, changing colors, placing mirrors or plants strategically, fixing broken items, adjusting lighting, and clearing clutter. Major renovations are only suggested if structural issues severely contradict Vastu principles."
        },
        {
          id: "vastu-5",
          question: "What's the ideal direction for the bedroom?",
          answer: "The Southwest is traditionally the best direction for the master bedroom, promoting stability and grounded relationships. Children's bedrooms do well in the Northwest. The Southeast is suitable for younger family members. Head direction is also important—sleeping with your head towards South or Southeast is preferred in Vastu. Avoid North for sleeping."
        },
        {
          id: "vastu-6",
          question: "Where should the kitchen be located in a house?",
          answer: "The Southeast corner is considered ideal for the kitchen (fire element direction). The East is the second-best option. Avoid the North, Northeast (unless in extremely spacious homes), and Southwest kitchens as they create health and financial issues. Kitchen should have proper ventilation and the cooking area shouldn't face the main entrance."
        },
        {
          id: "vastu-7",
          question: "How important are colors in Vastu?",
          answer: "Very important! Colors influence energy and emotions. Different rooms benefit from different colors: (1) Living areas—light, warm colors (yellow, orange), (2) Bedrooms—soft, calming colors (light blue, green, white), (3) Kitchens—saffron or light yellow, (4) Bathrooms—white or light colors, (5) Work areas—blue for concentration. Avoid excessive dark colors in main living spaces."
        },
        {
          id: "vastu-8",
          question: "Is water/fountains good for homes according to Vastu?",
          answer: "Yes! Water features (fountains, aquariums, water paintings) are auspicious in the Northeast, North, and East directions of the house. They attract prosperity and positive energy. However, avoid water in the Southwest, South, and Southeast as it creates problems. Ensure water features are clean and maintained—stagnant water is inauspicious."
        },
        {
          id: "vastu-9",
          question: "Can I apply Vastu to an apartment?",
          answer: "Absolutely! Apartments can have Vastu principles applied to individual units. While you can't change the building's overall structure, you can optimize your apartment's interior layout, furniture arrangement, colors, and elements. Apartment-specific adaptations are often practical and effective."
        },
        {
          id: "vastu-10",
          question: "Should I consider my birth chart when applying Vastu?",
          answer: "Yes! Combining Vastu with your astrological chart yields optimal results. Your chart shows which colors, directions, and elements are most favorable for you personally. We offer consultations that integrate both—custom Vastu recommendations aligned with your unique planetary influences for maximum benefit."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our Vedic astrology, healing, and spiritual services
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqData.map((category) => (
            <div
              key={category.title}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                <ChevronDown
                  size={24}
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    expandedCategories.has(category.title) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Category Items */}
              {expandedCategories.has(category.title) && (
                <div className="divide-y divide-gray-200">
                  {category.items.map((item) => (
                    <div key={item.id} className="border-l-4 border-transparent hover:border-purple-600">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {item.question}
                          </h3>
                          {expandedItems.has(item.id) && (
                            <p className="text-gray-700 leading-relaxed mt-3 whitespace-pre-wrap">
                              {item.answer}
                            </p>
                          )}
                        </div>
                        <ChevronDown
                          size={20}
                          className={`flex-shrink-0 text-purple-600 ml-4 transition-transform duration-300 ${
                            expandedItems.has(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-8 text-center border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Didn't find your answer?
          </h3>
          <p className="text-gray-700 mb-6">
            We're here to help! Reach out to our support team for any additional questions or concerns.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
