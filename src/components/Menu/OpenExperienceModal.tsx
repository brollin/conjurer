import { observer } from "mobx-react-lite";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useStore } from "@/src/types/StoreContext";
import { action } from "mobx";
import { useState } from "react";
import { ExperiencesTable } from "@/src/components/ExperiencesTable/ExperiencesTable";
import { useExperiencesAndUsers } from "@/src/hooks/experiencesAndUsers";

export const OpenExperienceModal = observer(function OpenExperienceModal() {
  const store = useStore();
  const { experienceStore, uiStore, username } = store;

  const [viewingAllExperiences, setViewingAllExperiences] = useState(false);
  const [isLoadingNewExperience, setIsLoadingNewExperience] = useState(false);

  const { isPending, isError, isRefetching, experiencesAndUsers } =
    useExperiencesAndUsers({
      username: viewingAllExperiences ? undefined : username,
      enabled: uiStore.showingOpenExperienceModal,
    });

  const onClose = action(() => (uiStore.showingOpenExperienceModal = false));

  if (isError) return null;

  return (
    <Modal
      onClose={onClose}
      isOpen={uiStore.showingOpenExperienceModal}
      isCentered
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Open experience{" "}
          {(isPending || isRefetching || isLoadingNewExperience) && (
            <Spinner ml={2} />
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isPending && experiencesAndUsers.length === 0 && (
            <Text color="gray.400">
              {username} has no saved experiences yet!
            </Text>
          )}
          <Switch
            mb={4}
            isChecked={viewingAllExperiences}
            onChange={(e) => setViewingAllExperiences(e.target.checked)}
          >
            View all experiences
          </Switch>
          {!isPending && (
            <ExperiencesTable
              experiencesAndUsers={experiencesAndUsers}
              onLoadExperience={action(async (experience) => {
                setIsLoadingNewExperience(true);
                await experienceStore.load(experience.name);
                setIsLoadingNewExperience(false);
                onClose();
              })}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
