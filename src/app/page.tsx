import { Text } from "@/system-design/atoms/Text";
import { Container } from "@/system-design/layouts/Container";

/**
 * Minimal placeholder home page, shell-wrapped so the real shell
 * (SiteHeader / SiteFooter / Container, added in Phase 3) is visible on
 * every route. The full home screen composition is a later per-screen PRP.
 */
export default function HomePage() {
  return (
    <main>
      <Container>
        <Text as="h1" variant="display" size="h1">
          Leonard&apos;s Garden
        </Text>
        <Text variant="body" size="body">
          Planting the foundation. The garden is being tended.
        </Text>
      </Container>
    </main>
  );
}
