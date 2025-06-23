import { useState } from "react";

export const useForm = () => {
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleAddData = () => {
    setFormData({});
    setShowModal(true);
  };

  const handleDisplayData = (data: any) => {
    setFormData(data);
    setShowModal(true);
  };

  const handleUpdateData = (data: any) => {
    setFormData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({});
  };

  return {
    formData,
    showModal,
    handleCloseModal,
    setFormData,
    handleDisplayData,
    handleAddData,
    handleUpdateData
  } as const;
};