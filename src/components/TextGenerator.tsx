import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const animationFeedback = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const animationText = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: .05,
    },
  },
};

const textVariants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
  exit: {
    x: 50,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const TextGenerator = () => {
  const [text, setText] = useState<string[]>([]);
  const [paragraphs, setParagraphs] = useState<Number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [paragraphs]);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 900);
      // Tem que chamar o clearTimeout dessa forma para garantir que ele sera executado
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  async function fetchData() {
    const response = await fetch(
      `http://hipsum.co/api/?type=hipster-centric&paras=${paragraphs}`
    );
    if (!response.ok) {
      throw new Error("Erro na aquisicao dos dados");
    }
    const data = await response.json();
    setText(data);
  }
  //   useEffect(()=>{

  //   },[text])
  async function copyToTransferArea() {
    let paras = "";
    text.map((text) => {
      paras += `\n${text}`;
    });
    try {
      await navigator.clipboard.writeText(paras);
    } catch {
      throw new Error("Houve um erro");
    }
  }

  return (
    <>
      <div className="inputContainer">
        <span>Paragraphs Number : </span>
        <input
          type="number"
          name="paragraphs"
          id="para"
          value={String(paragraphs)}
          onChange={(e) => {
            setParagraphs(Number(e.target.value));
          }}
        />
        <button
          onClick={() => {
            copyToTransferArea();
            setCopied(true);
          }}
        >
          {" "}
          Copy to clipboard{" "}
        </button>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={animationFeedback.initial}
              animate={animationFeedback.animate}
              exit={animationFeedback.exit}
              className="feedback"
            >
              {" "}
              Copied!{" "}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        variants={animationText}
        initial={animationText.initial}
        animate={animationText.animate}
        className="text"
      >
        <AnimatePresence>
          {text.map((paragraph, key) => {
            return (
              <motion.p
                variants={textVariants}
                initial={textVariants.initial}
                animate={textVariants.animate}
                exit={textVariants.exit}
                key={key}
              >
                {" "}
                {paragraph}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default TextGenerator;
