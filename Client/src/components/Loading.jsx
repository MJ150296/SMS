import React from "react";

function Loading() {
  return (
    <div className="w-full flex h-96 items-center justify-center space-x-2">
      <div className="max-w-8 h-8 bg-blue-600 rounded-full animate__animated animate__bounce"></div>
      <div className="max-w-8 h-8 bg-blue-400 rounded-full animate__animated animate__bounce animate__fast"></div>
      <div className="max-w-8 h-8 bg-blue-200 rounded-full animate__animated animate__bounce animate__faster"></div>
    </div>
  );
}

export default Loading;
