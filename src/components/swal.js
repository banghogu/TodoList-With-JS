import Swal from 'sweetalert2';

class CustomModal {
  constructor(modalHandler) {
    this.modalHandler = modalHandler;
  }
  static async showEditPrompt(currentTitle) {
    const { value: newTitle } = await Swal.fire({
      input: "text",
      inputValue: currentTitle,
      inputLabel: "할 일을 수정 하시나요?",
      inputPlaceholder: "여기에 수정 할 할일 입력",
      inputAttributes: {
        "aria-label": "Type the new todo text here"
      },
      showCancelButton: true
    });

    return newTitle;
  }
  async showConfirmation(todoId) {
    const result = await Swal.fire({
      title: '삭제하세요?',
      text: '복구 할 수 없어요!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제'
    });

    if (result.isConfirmed) {
      this.modalHandler(todoId);
    }
  }

  showDeletionSuccess() {
    Swal.fire({
      title: '삭제되었습니다',
      text: '할일이 삭제 되었습니다.',
      icon: 'success'
    });
  }

  static async showInputPrompt() {
    const { value: text } = await Swal.fire({
      input: "text",
      inputLabel: "새로운 할 일을 추가해보세요",
      inputPlaceholder: "여기에 새로운 할 일 작성",
      inputAttributes: {
        "aria-label": "Type your new todo here"
      },
      showCancelButton: true
    });

    return text;
  }
}

export default CustomModal;