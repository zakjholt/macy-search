import React from "react";
import { Container, Link, Heading, Grid } from "@chakra-ui/react";

export const Result = ({ name, pdfLink }) => (
  <Container border="1px" borderColor="gray.200" padding={2}>
    <Link href={pdfLink} target="_blank">
      <Heading size="sm">{name}</Heading>
      {/* <ExternalLinkIcon mx="2px" /> */}
    </Link>
  </Container>
);
