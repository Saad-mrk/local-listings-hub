import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Comment puis-je publier une annonce?",
    answer:
      "Cliquez sur 'Publier' en haut à droite, remplissez les informations et sélectionnez les images. Votre annonce sera publiée immédiatement.",
  },
  {
    question: "Combien de temps une annonce reste-t-elle active?",
    answer:
      "Une annonce reste active pendant 30 jours. Vous pouvez la renouveler gratuitement pour une autre période.",
  },
  {
    question: "Comment je peux payer en sécurité?",
    answer:
      "LBAL propose plusieurs méthodes de paiement sécurisées: carte bancaire, virement, Maroc Telecom Money, Orange Money et Wallet.",
  },
  {
    question: "Que faire si j'ai un problème avec un achat?",
    answer:
      "Contactez notre support client 24/7 via le chat. Nous médiatisons les litiges et protégeons vos intérêts.",
  },
  {
    question: "Est-ce gratuit de publier une annonce?",
    answer:
      "Oui! Les annonces basiques sont 100% gratuites. Des options premium sont disponibles pour plus de visibilité.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16">
      <div className="container max-w-3xl">
        <h2 className="text-3xl font-heading font-bold text-center mb-4">
          Questions fréquemment posées
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Trouvez les réponses à vos questions sur LBAL
        </p>

        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="border border-secondary/20 rounded-xl overflow-hidden"
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center gap-3 bg-card hover:bg-secondary/5 transition-colors text-left"
                whileHover={{ paddingLeft: 24 + 4 }}
              >
                <ChevronDown
                  className={`h-5 w-5 text-primary transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
                <span className="font-semibold flex-1">{faq.question}</span>
              </motion.button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-secondary/5 text-muted-foreground border-t border-secondary/20"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Help CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas trouvé votre réponse?
          </p>
          <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors inline-flex items-center gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            Contactez le support
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
