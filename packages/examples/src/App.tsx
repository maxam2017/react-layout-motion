import { useState } from "react";
import { Layout } from "react-layout-motion";

function WrapperA({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl m-5 min-h-[100px] flex items-center justify-center">
      {children}
    </div>
  );
}

function WrapperB({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-7 bg-gradient-to-br from-pink-400 to-red-500 rounded-[20px] m-5 min-h-[150px] flex items-center justify-center">
      {children}
    </div>
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
        <WrapperA>
          {!isInWrapperB && !showInC && (
            <Layout layoutId="shared-target">
              <Target />
            </Layout>
          )}
          {(isInWrapperB || showInC) && (
            <div className="text-white text-lg">
              Empty Wrapper A
            </div>
          )}
        </WrapperA>

        {/* Container B */}
        <WrapperB>
          {isInWrapperB && !showInC && (
            <Layout layoutId="shared-target">
              <Target />
            </Layout>
          )}
          {(!isInWrapperB || showInC) && (
            <div className="text-white text-lg">
              Empty Wrapper B
            </div>
          )}
        </WrapperB>

        {/* Container C */}
        {showInC && (
          <div className="p-6 bg-gradient-to-br from-green-300 to-blue-300 rounded-2xl m-5 min-h-[120px] flex items-center justify-center">
            <Layout layoutId="shared-target">
              <Target />
            </Layout>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Multiple Targets</h2>
        <div className="flex gap-5">
          <div className="p-5 bg-gray-100 rounded-lg flex-1">
            <Layout layoutId="item-1" style={{ marginBottom: "8px" }}>
              <div className="p-2.5 bg-red-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                Item 1
              </div>
            </Layout>

            {!isInWrapperB && (
              <Layout layoutId="item-2">
                <div className="p-2.5 bg-blue-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                  Item 2
                </div>
              </Layout>
            )}
          </div>

          <div className="p-5 bg-gray-50 rounded-lg flex-1">
            {isInWrapperB && (
              <Layout layoutId="item-2" style={{ marginBottom: "8px" }}>
                <div className="p-4 bg-blue-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                  Item 2 (Moved)
                </div>
              </Layout>
            )}

            <Layout layoutId="item-3" key={`item-3-${isInWrapperB}`}>
              <div className="p-2.5 bg-emerald-500 text-white rounded-md text-center transition-all duration-300 ease-in-out">
                Item 3
              </div>
            </Layout>
          </div>
        </div>
      </div>
    </div>
  );
}
