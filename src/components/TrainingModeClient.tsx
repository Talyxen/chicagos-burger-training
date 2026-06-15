"use client";

import { useState } from "react";
import { Play, X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TrainingModeClient.module.css";
import clsx from "clsx";

export default function TrainingModeClient({ steps, productName }: { steps: string[], productName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const isFinished = currentStep === steps.length;
  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setCurrentStep(0), 300);
  };

  return (
    <>
      <button className={styles.playButton} onClick={() => setIsOpen(true)}>
        <Play size={20} fill="currentColor" />
        <span>Modo Capacitación</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modal}
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className={styles.header}>
                <div>
                  <h3 className={styles.title}>Capacitación: {productName}</h3>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                      <motion.div 
                        className={styles.progressFill} 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className={styles.progressText}>{Math.round(progress)}%</span>
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={close}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.content}>
                <AnimatePresence mode="wait">
                  {!isFinished ? (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={styles.stepContent}
                    >
                      <div className={styles.stepBadge}>Paso {currentStep + 1}</div>
                      <h2 className={styles.stepDescription}>{steps[currentStep]}</h2>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="finished"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={styles.finishedContent}
                    >
                      <div className={styles.successIcon}>
                        <Check size={48} />
                      </div>
                      <h2>¡Preparación Completada!</h2>
                      <p>Has terminado de preparar {productName}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.footer}>
                {!isFinished ? (
                  <>
                    <button 
                      className={clsx(styles.navBtn, styles.prevBtn)} 
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft size={20} />
                      Anterior
                    </button>
                    <button 
                      className={clsx(styles.navBtn, styles.nextBtn)} 
                      onClick={handleNext}
                    >
                      {isLastStep ? "Finalizar" : "Siguiente"}
                      {!isLastStep && <ChevronRight size={20} />}
                    </button>
                  </>
                ) : (
                  <button className={clsx(styles.navBtn, styles.nextBtn)} onClick={close}>
                    Cerrar Capacitación
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
