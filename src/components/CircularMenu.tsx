import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface CircularMenuProps {
  items: string[];
  radius?: number;
  itemSize?: number;
  rotationAngle?: number;
  onSelect?: (item: string, index: number) => void;
}

const MenuContainer = styled.div<{ $radius: number }>`
  position: relative;
  width: ${props => props.$radius * 2}px;
  height: ${props => props.$radius * 2}px;
  margin: 0 auto;
  user-select: none;
`;

const MenuItemWrapper = styled.div<{
  $angle: number;
  $radius: number;
  $isActive: boolean;
  $scale: number;
}>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
  transform: rotate(${props => props.$angle}deg)
             translate(${props => props.$radius}px)
             rotate(${props => -props.$angle}deg)
             translate(-50%, -50%)
             scale(${props => props.$scale});
  transition: all 0.3s ease-out;
  cursor: pointer;
  
  span {
    white-space: nowrap;
    color: ${props => props.$isActive ? '#000' : '#666'};
    font-size: ${props => props.$isActive ? '24px' : '18px'};
    font-weight: ${props => props.$isActive ? '600' : '400'};
    transition: all 0.3s ease-out;
  }
`;

const Marker = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
  transform: translateX(-50%);
`;

const CircularMenu = ({
  items,
  radius = 200,
  itemSize = 40,
  rotationAngle = 0,
  onSelect
}: CircularMenuProps) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemAngle = 360 / items.length;
  const activeIndex = Math.round(-currentAngle / itemAngle) % items.length;
  const normalizedActiveIndex = activeIndex < 0 ? items.length + activeIndex : activeIndex;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5;
    const newAngle = currentAngle - delta;
    setCurrentAngle(newAngle);
    snapToClosestItem(newAngle);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartAngle(currentAngle);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const delta = e.clientX - startX;
    const newAngle = startAngle + delta * 0.5;
    setCurrentAngle(newAngle);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToClosestItem(currentAngle);
  };

  const snapToClosestItem = (angle: number) => {
    const snappedAngle = Math.round(angle / itemAngle) * itemAngle;
    setCurrentAngle(snappedAngle);
    
    const index = Math.round(-snappedAngle / itemAngle) % items.length;
    const normalizedIndex = index < 0 ? items.length + index : index;
    onSelect?.(items[normalizedIndex], normalizedIndex);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isDragging) {
        setIsDragging(false);
        snapToClosestItem(currentAngle);
      }
    };

    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, [isDragging, currentAngle]);

  return (
    <MenuContainer
      $radius={radius}
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <Marker />
      {items.map((item, index) => {
        const angle = index * itemAngle + currentAngle + rotationAngle;
        const isActive = index === normalizedActiveIndex;
        const scale = isActive ? 1 : 0.8;

        return (
          <MenuItemWrapper
            key={index}
            $angle={angle}
            $radius={radius}
            $isActive={isActive}
            $scale={scale}
          >
            <span>{item}</span>
          </MenuItemWrapper>
        );
      })}
    </MenuContainer>
  );
};

export default CircularMenu; 