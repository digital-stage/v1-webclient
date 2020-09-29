import React, {useEffect, useState} from "react";
import {styled} from "styletron-react";
import {LabelMedium} from "baseui/typography";
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import {useStyletron} from "baseui";
import CanvasPlayer from "../../video/CanvasPlayer";
import Client from "../../../lib/digitalstage/common/model.client";

const Card = styled("div", {
    position: "relative",
    backgroundColor: "black",
});

const CardConstraint = styled("div", {
    position: "relative",
    width: "100%",
    paddingTop: "75%"

})

const CardContent = styled("div", {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
})

const SoundjackLogo = styled("img", {
    position: "absolute",
    width: "48px",
    height: "48px",
    top: 0,
    right: 0
});

const PoweredBySoundjack = styled("div", {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    top: "30px"
})

export default (props: {
    members?: Client.GroupMember[]
}) => {
    const [numDesktopCols, setNumDesktopCols] = useState<number>(1);
    const [css] = useStyletron();

    useEffect(() => {
        if (props.members && props.members.length <= 1) {
            setNumDesktopCols(1);
        } else {
            if (props.members.length > 4) {
                setNumDesktopCols(4)
            } else {
                setNumDesktopCols(2)
            }
        }
    }, [props.members])

    return (
        <>
            <FlexGrid
                width="100%"
                flexGridColumnCount={[
                    1,
                    props.members.length > 1 ? 2 : 1,
                    props.members.length > 1 ? 2 : 1,
                    numDesktopCols
                ]}
                flexGridColumnGap="scale800"
                flexGridRowGap="scale800"
            >
                {props.members && props.members.map(member => (
                    <FlexGridItem key={member._id}>
                        <Card>
                            <CardConstraint/>
                            <CardContent>
                                {member.ovProducers.length > 0 && (
                                    <>
                                        <SoundjackLogo src={"soundjack.png"}/>
                                        <PoweredBySoundjack>
                                            <LabelMedium>
                                                Powered by ovbox
                                            </LabelMedium>
                                        </PoweredBySoundjack>
                                    </>
                                )}
                                <CanvasPlayer
                                    className={css({
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%"
                                    })}
                                    consumers={member.videoConsumers}/>
                                <div className={css({
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    display: 'flex',
                                    alignItems: 'center'
                                })}>
                                    <div className={css({
                                        width: "1rem",
                                        height: "1rem",
                                        backgroundColor: member.online ? "green" : "red",
                                        borderRadius: "50%",
                                        marginRight: ".5rem"
                                    })}>
                                    </div>
                                    <LabelMedium $style={{
                                        textShadow: "rgb(0, 0, 0) 0px 0px 4px"
                                    }}>
                                        {member.name}
                                    </LabelMedium>
                                </div>
                            </CardContent>
                        </Card>
                    </FlexGridItem>
                ))}
            </FlexGrid>

        </>
    )
}
