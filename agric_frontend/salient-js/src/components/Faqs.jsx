import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'How does AI help in increasing crop yields?',
      answer:
        'AI analyzes various factors like soil conditions, weather patterns, and crop health to provide data-driven recommendations for optimizing crop growth.',
    },
    {
      question: 'Can AI predict the best time for planting?',
      answer:
        'Yes, the AI model processes historical weather data and current conditions to suggest the ideal planting times for different crops.',
    },
    {
      question: 'How accurate is AI in detecting crop diseases?',
      answer:
        'Our AI model uses advanced image recognition to detect early signs of diseases with up to 95% accuracy, allowing for timely intervention.',
    },
  ],
  [
    {
      question: 'Does the AI model support organic farming?',
      answer:
        'Absolutely. Our AI is designed to support both conventional and organic farming practices by providing tailored advice based on your farming methods.',
    },
    {
      question: 'Can AI help with pest control?',
      answer:
        'Yes, the AI system can identify pest infestations early and recommend the most effective and eco-friendly treatment options.',
    },
    {
      question: 'How does AI assist in water management?',
      answer:
        'AI monitors soil moisture levels and weather forecasts to optimize irrigation schedules, helping conserve water while ensuring crops get the hydration they need.',
    },
  ],
  [
    {
      question: 'Is the AI model customizable for different crops?',
      answer:
        'Yes, our AI system is adaptable and can be customized to provide specific advice based on the type of crops you are growing.',
    },
    {
      question: 'Can the AI model integrate with existing farm equipment?',
      answer:
        'Our AI is compatible with most modern farming equipment, allowing for seamless integration and automated data collection.',
    },
    {
      question: 'How secure is the data collected by the AI model?',
      answer:
        'We take data security seriously. All data collected by the AI model is encrypted and stored securely, with access restricted to authorized personnel only.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, email our support team
            and if you’re lucky someone will get back to you.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
