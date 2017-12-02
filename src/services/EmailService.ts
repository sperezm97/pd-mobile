import { format } from 'date-fns';
import { openComposer } from 'react-native-email-link';
import { LogEntry } from '~/models/logs/LogEntry';

export namespace EmailService {

    export const emailLogEntry = (logEntry: LogEntry, poolEmail:string) => {
        const emailBody = createEmailBody(logEntry);
        const subject = 'Pool Service Summary';
        sendEmail(subject, emailBody, poolEmail);
    };

    // function that accepts LogEntry and returns string for email body
    const createEmailBody = (logEntry: LogEntry) => {
        // putting date in format desired for email body
        const ts = logEntry.userTS;
        const dateFormat = format(ts, 'MMM d, y') + format(ts, '  //  h:mma').toLowerCase();

        // creating Readings string for body of email
        const readings = logEntry.readingEntries
            .map((r) => {
                if (r.units === null) {
                    return `${r.readingName}: ${r.value}`;
                } else {
                    return `${r.readingName}: ${r.value} ${r.units}`;
                }
            })
            .join('\n');

        // creating Treatments string for body of email
        const treatments = logEntry.treatmentEntries
            .map((t) => {
                return `${t.treatmentName}: ${t.displayAmount} ${t.displayUnits}`;
            })
            .join('\n');

        // return string that will be body of email
        let emailBody = (
            dateFormat +
            '\n\n' +
            'Readings:\n' +
            readings +
            '\n\n' +
            'Treatments:\n' +
            treatments +
            '\n\n' +
            'Notes:\n' +
            logEntry.notes);
        if (logEntry.notes) {
            emailBody += (
            '\n\n' +
            'Notes:\n' +
            logEntry.notes);
        }
        return emailBody;
    };

    // function that sends the email and accepts strings for subject and logEntry
    const sendEmail = (subject: string, emailBody: string, poolEmail: string) => {
        // for now I've hardcoded subject, but if its value came from somewhere, this would autopopulate
        // the subject line if it is undefined
        if (subject === undefined) {
            subject = 'Pool Service Summary';
        }

        try {
            openComposer({
                subject,
                to: poolEmail,
                body: emailBody,
            });
        } catch (e) {
            console.error('Could not open email app: ' + e);
        }
    };
}
