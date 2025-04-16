import styled from 'styled-components';
import CircularMenu from './components/CircularMenu';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

function App() {
  const menuItems = [
    'Make a song',
    'Make a song for your friend',
    'Make a song about the moon',
    'Make a song for your mom',
    'Make a song for your pet',
    'Make a song about love'
  ];

  const handleSelect = (item: string, index: number) => {
    console.log(`Selected: ${item} at index ${index}`);
  };

  return (
    <AppContainer>
      <Title>Circular Menu Demo</Title>
      <CircularMenu
        items={menuItems}
        radius={250}
        onSelect={handleSelect}
      />
    </AppContainer>
  );
}

export default App;
