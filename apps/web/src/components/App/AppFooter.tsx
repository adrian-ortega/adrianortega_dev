import { Container } from "../Core/Container";
import { Group } from "../Core/Group"

const AppFooter = () => {
  const year = new Date().getFullYear();
  return (
    <Container>
      <Group justifyContent="center">
        &copy; {year} Adrian Ortega | All rights reserved.
      </Group>
    </Container>
  )
}

export default AppFooter;
