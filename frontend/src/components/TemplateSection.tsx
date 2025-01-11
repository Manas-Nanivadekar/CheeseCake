import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TemplateSection() {
  const [activeTemplate, setActiveTemplate] = useState("mcq");

  const templates = [
    { id: "mcq", name: "MCQ Template", image: "/mcq.png" },
    {
      id: "arrangeInOrder",
      name: "Arrange in Order",
      image: "/arrangeInOrder.png",
    },
    {
      id: "fillBlanks",
      name: "Fill in the Blanks",
      image: "/fillInTheBlanks.png",
    },
    { id: "trueFalse", name: "True or False", image: "/trueFalse.png" },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#fe8080] to-[#ff9090] py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider">
            TEMPLATES
          </div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            Steal our templates and get started quick
          </h2>
          <p className="text-lg md:text-xl">
            Get inspired by expert-made templates from our community
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-16 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className={cn(
                "group relative cursor-pointer rounded-2xl bg-white p-4 transition-all duration-300 hover:shadow-2xl",
                activeTemplate === template.id && "ring-2 ring-[#0A0B1F]"
              )}
              onClick={() => setActiveTemplate(template.id)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="aspect-video overflow-hidden rounded-xl">
                <img
                  src={template.image}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-[#0A0B1F]">
                  {template.name}
                </h3>
                <motion.div
                  className="mt-2 inline-flex items-center text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTemplate === template.id ? 1 : 0 }}
                >
                  <span className="mr-2">●</span>
                  Currently Selected
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 rounded-2xl bg-white p-8 shadow-xl"
          layout
          key={activeTemplate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={templates.find((t) => t.id === activeTemplate)?.image}
            alt={templates.find((t) => t.id === activeTemplate)?.name}
            className="mx-auto h-auto w-full max-w-4xl rounded-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
