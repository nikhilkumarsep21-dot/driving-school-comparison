import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EnquiryEmailProps {
  name: string;
  email: string;
  phone: string;
  schoolName?: string;
  message?: string;
  licenseType?: string;
  licenseStatus?: string;
  licenseAge?: string;
  packageType?: string;
  location?: string;
  startTime?: string;
}

export const EnquiryEmail = ({
  name,
  email,
  phone,
  schoolName,
  message,
  licenseType,
  licenseStatus,
  licenseAge,
  packageType,
  location,
  startTime,
}: EnquiryEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🚗 New Lead Enquiry</Heading>

          {schoolName && (
            <Text style={schoolText}>
              For: <strong>{schoolName}</strong>
            </Text>
          )}

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Contact Information
            </Heading>
            <Text style={text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={text}>
              <strong>Phone:</strong> {phone}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Enquiry Details
            </Heading>
            {licenseType && (
              <Text style={text}>
                <strong>License Type:</strong> {licenseType}
              </Text>
            )}
            {licenseStatus && (
              <Text style={text}>
                <strong>License Status:</strong> {licenseStatus}
              </Text>
            )}
            {licenseAge && (
              <Text style={text}>
                <strong>License Age:</strong> {licenseAge}
              </Text>
            )}
            {packageType && (
              <Text style={text}>
                <strong>Package Type:</strong> {packageType}
              </Text>
            )}
            {location && (
              <Text style={text}>
                <strong>Location:</strong> {location}
              </Text>
            )}
            {startTime && (
              <Text style={text}>
                <strong>Preferred Start Time:</strong> {startTime}
              </Text>
            )}
            {message && (
              <>
                <Text style={text}>
                  <strong>Message:</strong>
                </Text>
                <Text style={messageText}>{message}</Text>
              </>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This enquiry was submitted through your driving school comparison
            platform.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EnquiryEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0 40px",
};

const h2 = {
  color: "#374151",
  fontSize: "20px",
  fontWeight: "600",
  margin: "20px 0 10px",
};

const schoolText = {
  color: "#059669",
  fontSize: "16px",
  margin: "0 40px 20px",
};

const text = {
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const messageText = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0",
  padding: "12px",
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

const section = {
  padding: "0 40px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "26px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 40px",
  marginTop: "20px",
};
