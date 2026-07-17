import { IconBrandGithubFilled, IconBrandLinkedinFilled } from "@tabler/icons-react";
import { Box } from "../Core/Box";
import { Container } from "../Core/Container";
import { Group } from "../Core/Group"

type IconLink = {
  label: string;
  url: string;
  icon: React.ElementType;
}

const AppFooter = () => {
  const year = new Date().getFullYear();
  const iconLinks: IconLink[] = [
    { label: "GitHub", url: "https://github.com/adrian-ortega", icon: IconBrandGithubFilled },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/ortega-adrian/", icon: IconBrandLinkedinFilled },
  ];
  return (
    <Box className="Footer-root">
      <Container>
        <Group justifyContent="center">
          <Box>&copy; {year} Adrian Ortega | All rights reserved.</Box>
          <Box>
            <Group component="nav" gap={2}>
              {iconLinks.map(({ label, url, icon: Icon }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="IconLink-root"
                >
                  <Icon size={24} />
                </a>
              ))}
            </Group>
          </Box>
        </Group>
      </Container>
    </Box>
  );
}

export default AppFooter;
