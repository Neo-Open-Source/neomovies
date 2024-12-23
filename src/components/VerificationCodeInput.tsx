'use client';

import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
`;

const Input = styled.input`
  width: 3rem;
  height: 3.5rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2196f3;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 4px rgba(33,150,243,0.1);
  }
`;

interface Props {
  length?: number;
  onChange: (code: string) => void;
}

export function VerificationCodeInput({ length = 6, onChange }: Props) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    
    const combinedCode = newCode.join('');
    onChange(combinedCode);

    if (slot !== length - 1 && num) {
      inputs.current[slot + 1]?.focus();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.key === 'Backspace' && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = '';
      setCode(newCode);
      inputs.current[slot - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteNumbers = paste.match(/[0-9]/g);
    
    if (!pasteNumbers) return;
    
    const newCode = [...code];
    pasteNumbers.forEach((num, i) => {
      if (i >= length) return;
      newCode[i] = num;
      inputs.current[i]?.value = num;
    });
    
    setCode(newCode);
    onChange(newCode.join(''));
    inputs.current[Math.min(pasteNumbers.length, length - 1)]?.focus();
  };

  return (
    <Container>
      {code.map((num, idx) => (
        <Input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={num}
          autoFocus={!code[0].length && idx === 0}
          onChange={(e) => processInput(e, idx)}
          onKeyUp={(e) => onKeyUp(e, idx)}
          onPaste={handlePaste}
          ref={(ref) => inputs.current[idx] = ref}
        />
      ))}
    </Container>
  );
}
