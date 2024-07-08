import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import NameDesVerfahrens from './faq_text/NameDesVerfahrens.jsx';
import Beteiligungsprozess from './faq_text/Beteiligungsprozess.jsx';
import ErgebnisseBeteiligung from './faq_text/ErgebnisseBeteiligung.jsx';
import WieBeteiligen from './faq_text/WieBeteiligen.jsx';
import Netiquette from './faq_text/Netiquette.jsx';
import Regeln from './faq_text/Regeln.jsx';
import Wer from './faq_text/Wer.jsx';
import Schwierigkeiten from './faq_text/Schwierigkeiten.jsx';
import Anforderungen from './faq_text/Anforderungen.jsx';
import Datenschutz from './faq_text/Datenschutz.jsx';
import Melden from './faq_text/Melden.jsx';

function GuidelineContent() {
    const faqs = [
        {header: 'Netiquette', question: "Welche Netiquette gilt für die Teilnahme an der Diskussion?", answer: <Netiquette />},
        // Add more FAQs here
    ];


    const [open, setOpen] = React.useState(Array(faqs.length).fill(true)); // Initialize an array with two items

    const handleClick = (index) => {
        setOpen(open.map((item, i) => (i === index ? !item : item)));
    };


    return (
        <div style={{ overflowY: 'auto', maxHeight: '75vh' , marginLeft: "10px"}}>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {faqs.map((faq, index) => (
                    <div key={index}>
                        <h4 style={{color: "darkblue"}}>{faq.header}</h4>
                        <ListItemButton>
                            <ListItemText primary={faq.question} />
                        </ListItemButton>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemText style={{backgroundColor: "floralwhite", padding: "20px", borderRadius: "10px"}}  sx={{ pl: 4 }}>
                                    <div style={{fontSize: "15px"}}>{faq.answer}</div>
                                </ListItemText>
                            </List>
                        </Collapse>
                    </div>
                ))}
            </List>
        </div>
    );
}

export default GuidelineContent;
