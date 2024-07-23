import { Paper, Text } from '@mantine/core';
import Search from './search';

export default function Preview() {
    return (
    <>
        <Search readOnly defaultValue='Explain the performance of Team 18225.'></Search>
        <Paper mt='lg' withBorder radius='xl' shadow='md' p='lg'>
            <Text size='sm'>
                {`The team's Autonomous period is strong, with an average of 90.2 points and a high score of 123 points, driven by their ability to earn yellow and purple pixel points. In TeleOP, they consistently score around 86.7 points on average, with a high score of 114 points, indicating a reliable robot performance. In Endgame, they average 67 points, with a high score of 90 points, showing they can effectively navigate and earn points in this period. The team's penalty score is 60 points, which is relatively low. Overall, the team's highest score is 313 points, and their lowest score is 162 points, indicating some inconsistency in their performance.`}
            </Text>
        </Paper>
    </>
    );
}