/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import {jsx, Flex, Input, Button, Box} from "theme-ui";
import {useIntl} from "react-intl";
import {ChatMessages, useSelector} from "../../lib/use-digital-stage";

const StageChat = () => {
    const messages = useSelector<ChatMessages>(state => state.chatMessages);
    const {formatMessage} = useIntl();
    const f = (id) => formatMessage({id});

    return (
        <Box
            sx={{
                height: '100vh',
            }}
        >
            <Flex sx={{
                flexDirection: 'column'
            }}>
                {messages.map(message => (
                    <Flex>
                        {message.userId} wrote:
                        {message.message}
                    </Flex>
                ))}

            </Flex>
            <Flex
                sx={{}}
            >
                <Input
                    sx={{
                        flexGrow: 1
                    }}
                    type="text"
                />
                <Button
                    variant="primary"
                >
                    {f('sendMessage')}
                </Button>

            </Flex>

        </Box>
    );
}
export default StageChat;