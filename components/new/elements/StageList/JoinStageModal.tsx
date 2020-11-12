import React from 'react';
import {
    Flex, Button, Text,
} from 'theme-ui';
import Modal from '../Modal';
import InputField from '../../../InputField';
import { useRouter } from 'next/router';

const JoinStageModal = (props: {
    isOpen?: boolean;
    onClose?: () => void;
}): JSX.Element => {
    const { isOpen, onClose } = props;
    const router = useRouter();
    const [link, setLink] = React.useState<string>();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    }

    const joinStage = () => {
        if (link) {
            const port: string = window.location.port ? `:${window.location.port}` : '';
            const path: string = link.replace(`${window.location.protocol}/${window.location.hostname}${port}`, "")
            router.push(path)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Text variant="title">Join stage via link</Text>
            <Text variant="subTitle">Enter the link of a group in a stage you want to enter</Text>
            <InputField type="text" id="link" name="link" label="Link" onChange={onChange} value={link} version="dark" />
            <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
                <Button variant="black" onClick={onClose}>Schließen</Button>
                <Button onClick={joinStage} autoFocus>
                    Join stage
                </Button>
            </Flex>
        </Modal>
    );
};

export default JoinStageModal;
