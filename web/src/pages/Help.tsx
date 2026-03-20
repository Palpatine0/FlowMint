import { HelpCircle, Book, Shield, MessageCircle, ChevronRight } from 'lucide-react';

export function Help() {
  const sections = [
    {
      icon: Book,
      title: 'Getting Started',
      description:
        'Learn the basics of tracking your expenses and managing your budget effectively.',
      items: [
        'How to add your first transaction',
        'Setting up recurring bills and subscriptions',
        'Creating and funding savings goals',
      ],
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description:
        "Your financial data stays on your device. We don't store anything on our servers.",
      items: [
        'How local storage works',
        'Exporting your data for backup',
        'Managing your Gemini API key for AI features',
      ],
    },
    {
      icon: HelpCircle,
      title: 'Common Questions',
      description: 'Quick answers to the most frequently asked questions.',
      items: [
        'Can I sync with my real bank account?',
        'How are exchange rates calculated?',
        'What happens if I clear my browser cache?',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="text-primary-500" />
          Help Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Everything you need to know about mastering your finances with FlowMint.
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-500">
                <section.icon size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-500 transition-colors">
                    {item}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 dark:text-slate-600 group-hover:text-primary-400"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl text-white shadow-lg shadow-primary-200 dark:shadow-none relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-primary-50 text-sm mb-6 max-w-md">
            Our community is here to help. Reach out or check our detailed documentation on GitHub.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-white text-primary-600 rounded-xl text-sm font-bold hover:bg-primary-50 transition-colors flex items-center gap-2">
              <MessageCircle size={18} />
              Contact Support
            </button>
            <button className="px-6 py-2.5 bg-primary-700/30 text-white border border-primary-400/30 rounded-xl text-sm font-bold hover:bg-primary-700/40 transition-colors">
              Visit Documentation
            </button>
          </div>
        </div>
        <HelpCircle
          size={180}
          className="absolute -bottom-10 -right-10 text-primary-400/20 rotate-12"
        />
      </div>
    </div>
  );
}
