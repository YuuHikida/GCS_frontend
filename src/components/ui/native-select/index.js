// src/components/ui/native-select/index.js
import React from 'react';
import { Button, Input, Stack } from "@chakra-ui/react";

export const NativeSelectRoot = ({ children }) => (
  <div className="native-select-root">{children}</div>
);

export const NativeSelectField = ({ name, items, value, onChange }) => (
  <select name={name} value={value} onChange={onChange}>
    {items.map((item, index) => (
      <option key={index} value={item}>
        {item}
      </option>
    ))}
  </select>
);