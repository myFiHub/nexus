"use client";
import { Img } from "../../..//components/Img";

const ImageSelector = () => {
  return (
    <div
      style={{
        marginBottom: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          overflow: "hidden",
          background: "#232b36",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Img
          src={undefined}
          alt="Outpost image"
          style={{ width: 56, height: 56 }}
        />
      </div>
      <button
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontWeight: 500,
          fontSize: 18,
          marginBottom: 2,
          cursor: "pointer",
        }}
      >
        Select image from gallery
      </button>
      <div style={{ color: "#b0b8c1", fontSize: 13 }}>
        Select image from gallery
      </div>
    </div>
  );
};

export default ImageSelector;
