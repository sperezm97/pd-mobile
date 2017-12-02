import React from 'react';
import { Insets, SectionList as RnSectionList, SectionListData, StyleSheet } from 'react-native';
import { ForumPrompt } from '~/screens/home/footer/ForumPrompt';
import { AV, useSectionListHeaderAnimation } from '../animation/AnimationHelpers';

import { PDText } from '../PDText';
import { PDSpacing, useTheme } from '../PDTheme';
import { PDSection, PDSectionListData } from './models';
import { PDSectionListItem } from './PDSectionListItem';


interface SectionListProps {
    sections: SectionListData<PDSectionListData, PDSection>[];
    showFooter: boolean;
    insets?: Insets;
}

export const PDSectionList: React.FC<SectionListProps> = (props) => {
    const { sections, showFooter } = props;
    const footerComponent = showFooter ? <ForumPrompt /> : <></>;
    const theme = useTheme();
    const { sectionHeaderOpacity } = useSectionListHeaderAnimation();



    return (
        <RnSectionList
            sections={ sections }
            renderSectionHeader={ ({ section: { title } }) => (
                <AV opacity={ sectionHeaderOpacity }>
                    <PDText type="bodyBold" color="greyDark" style={ styles.sectionHeaderText }>
                        {title}
                    </PDText>
                </AV>
            ) }
            renderItem={ ({ item, index, section }) => (
                <PDSectionListItem
                    { ...item }
                    sectionLength={ section.data.length }
                    index={ index } />
            ) }
            keyExtractor={ (item, index) => item.id + index }
            stickySectionHeadersEnabled={ false }
            contentContainerStyle={ styles.listContent }
            style={ [styles.listContainer, { backgroundColor: theme.colors.greyLightest  }] }
            ListFooterComponent={ footerComponent }
            contentInset={ props.insets }
            initialNumToRender={ 50 }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: PDSpacing.md,
    },
    sectionHeaderText: {
        marginBottom: PDSpacing.md,
        marginTop: PDSpacing.lg,
        textTransform: 'uppercase',
    },
});
