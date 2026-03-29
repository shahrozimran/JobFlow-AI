import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ResumeData } from "./AtsTemplate";

// Register fonts for standard true-to-life ATS aesthetics
// Note: In browser, it uses default fonts if not explicitly registered, but Times-Roman is built-in.
Font.register({
  family: "Times-Roman",
});

const styles = StyleSheet.create({
  page: {
    padding: 30, // Normal professional padding
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#000000",
  },
  header: {
    marginBottom: 15,
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "heavy", // Times-Roman bold variant is triggered internally
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "Times-Roman",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 10,
    color: "#333",
  },
  contactItem: {
    marginHorizontal: 3,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "heavy",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    textAlign: "justify",
  },
  itemBlock: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: "heavy",
    fontSize: 11,
  },
  itemDates: {
    fontSize: 10,
  },
  itemSubHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 10,
    fontStyle: "italic",
  },
  bulletList: {
    marginLeft: 10,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
    textAlign: "justify",
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    marginRight: 8,
    marginBottom: 2,
  },
  certItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
});

interface AtsPdfTemplateProps {
  data: ResumeData;
}

export const AtsPdfTemplate = ({ data }: AtsPdfTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo?.name || "YOUR NAME"}</Text>
          <View style={styles.contactRow}>
            {[
              data.personalInfo?.location,
              data.personalInfo?.email,
              data.personalInfo?.phone,
              data.personalInfo?.linkedin,
              data.personalInfo?.github,
            ]
              .filter(Boolean)
              .map((item, i, arr) => (
                <View key={i} style={{ flexDirection: "row" }}>
                  <Text style={styles.contactItem}>{item}</Text>
                  {i < arr.length - 1 && <Text> | </Text>}
                </View>
              ))}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
            <View style={styles.skillsRow}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  • {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemDates}>{exp.dates}</Text>
                </View>
                {(exp.company || exp.location) && (
                  <View style={styles.itemSubHeader}>
                    <Text>{exp.company}</Text>
                    <Text>{exp.location}</Text>
                  </View>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((bullet, bIndex) => (
                      <View key={bIndex} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDates}>{edu.dates}</Text>
                </View>
                <View style={styles.itemSubHeader}>
                  <Text>
                    {edu.school}
                    {edu.location ? `, ${edu.location}` : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{cert}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
