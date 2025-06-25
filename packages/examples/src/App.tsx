import { useState } from "react";
import { Motion } from "react-layout-motion";

const LayoutConfig = {
  duration: 400,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

function WrapperA({ children, zIndex }: { children: React.ReactNode; zIndex: number }) {
  return (
    <Motion
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 800, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      layoutTransition={{ origin: "top" }}
      style={{ zIndex }}

      key={children ? "wrapper-a" : "wrapper-a-empty"}
      className="relative p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl m-5 min-h-[100px] flex items-center justify-center"
    >
      {children}
    </Motion>
  );
}

function WrapperB({ children, zIndex }: { children: React.ReactNode; zIndex: number }) {
  return (
    <Motion
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 200, duration: 800, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      layoutTransition={{ origin: "top" }}
      style={{ zIndex }}

      key={children ? "wrapper-b" : "wrapper-b-empty"}
      className="relative p-7 bg-gradient-to-br from-pink-400 to-red-500 rounded-[20px] m-5 min-h-[100px] flex items-center justify-center"
    >
      {children}
    </Motion>
  );
}

function Target() {
  return (
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 shadow-lg transition-all duration-300 ease-in-out">
      🎯
    </div>
  );
}

// Demo App
export default function App() {
  const [isInWrapperB, setIsInWrapperB] = useState(false);
  const [showInC, setShowInC] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(0.95)";
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <div className="p-5 font-sans">
      <h1 className="text-center mb-8">
      </h1>

      <div className="flex gap-5 mb-5">
        <button
          onClick={() => setIsInWrapperB(!isInWrapperB)}
          className="px-6 py-3 bg-indigo-600 text-white border-none rounded-lg cursor-pointer text-base transition-transform duration-200 ease-in-out hover:bg-indigo-700"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          Toggle A ↔ B
        </button>

        <button
          onClick={() => setShowInC(!showInC)}
          className="px-6 py-3 bg-emerald-600 text-white border-none rounded-lg cursor-pointer text-base transition-transform duration-200 ease-in-out hover:bg-emerald-700"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          Toggle C
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Single Target</h2>
        {/* Container A */}
        <WrapperA zIndex={isInWrapperB || showInC ? 1 : 100}>
          {!isInWrapperB && !showInC && (
            <Motion layoutId="shared-target" layoutTransition={LayoutConfig}>
              <Target />
            </Motion>
          )}
          {(isInWrapperB || showInC) && (
            <Motion layoutId="a-text" className="text-white text-lg">
              Empty Wrapper A
            </Motion>
          )}
        </WrapperA>

        {/* Container B */}
        <WrapperB zIndex={!isInWrapperB || showInC ? 1 : 100}>
          {isInWrapperB && !showInC && (
            <Motion layoutId="shared-target" layoutTransition={LayoutConfig}>
              <Target />
            </Motion>
          )}
          {(!isInWrapperB || showInC) && (
            <div className="text-white text-lg">
              Empty Wrapper B
            </div>
          )}
        </WrapperB>

        {/* Container C */}
        {showInC && (
          <div
            style={{ zIndex: 100 }}
            className="relative p-6 bg-gradient-to-br from-green-300 to-blue-300 rounded-2xl m-5 min-h-[120px] flex items-center justify-center"
          >
            <Motion layoutId="shared-target" layoutTransition={LayoutConfig}>
              <Target />
            </Motion>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Multiple Targets</h2>
        <div className="flex gap-5">
          <div className="p-5 bg-gray-100 rounded-lg flex-1">
            <Motion layoutId="item-1" style={{ marginBottom: "8px" }} layoutTransition={LayoutConfig}>
              <div className="p-2.5 bg-red-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                Item 1
              </div>
            </Motion>

            {!isInWrapperB && (
              <Motion layoutId="item-2" layoutTransition={LayoutConfig}>
                <div className="p-2.5 bg-blue-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                  Item 2
                </div>
              </Motion>
            )}
          </div>

          <div className="p-5 bg-gray-50 rounded-lg flex-1">
            {isInWrapperB && (
              <Motion layoutId="item-2" style={{ marginBottom: "8px" }} layoutTransition={LayoutConfig}>
                <div className="p-4 bg-blue-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                  Item 2 (Moved)
                </div>
              </Motion>
            )}

            <Motion layoutId="item-3" key={`item-3-${isInWrapperB}`} layoutTransition={LayoutConfig}>
              <div className="p-2.5 bg-emerald-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                Item 3
              </div>
            </Motion>
          </div>
        </div>
      </div>
    </div>
  );
}
