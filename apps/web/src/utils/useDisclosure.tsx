export default function useDisclosure() {
  // @TODO implement mantine like disclousure hook

  return [
    false, // Boolean state
    
    {
    open: () => void (0),   // Stets Boolean State to true
    close: () => void (0),  // Stets Boolean State to false
    toggle: () => void (0), // Stets Boolean State to its opposite state
  }]
}
