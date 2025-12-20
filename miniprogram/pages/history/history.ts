// history.ts
interface HistoryRecord {
  id: string;
  timestamp: string;
  agtron: number;
  roastLevel: string;
  colorDetail: string;
  lStar: number;
  samplePoints: Array<{
    lab: {
      l: number;
      a: number;
      b: number;
    };
  }>;
}

Page({
  data: {
    historyList: [] as HistoryRecord[],
    isEmpty: true,
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 每次显示页面时重新加载历史记录
    this.loadHistory();
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const historyStr = wx.getStorageSync('roastHistory') || '[]';
      const history = JSON.parse(historyStr);

      // 格式化时间显示
      const formattedHistory = history.map((record: HistoryRecord) => {
        const date = new Date(record.timestamp);
        return {
          ...record,
          formattedTime: this.formatTime(date),
          formattedDate: this.formatDate(date),
        };
      });

      this.setData({
        historyList: formattedHistory,
        isEmpty: formattedHistory.length === 0,
      });
    } catch (error) {
      console.error('加载历史记录失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      });
    }
  },

  /**
   * 格式化时间
   */
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * 格式化日期
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 查看记录详情
   */
  viewDetail(e: any) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.historyList[index];

    // 构建详细信息文本
    let detailText = `Agtron值: ${record.agtron}\n`;
    detailText += `烘焙度: ${record.roastLevel}\n`;
    detailText += `颜色: ${record.colorDetail}\n`;
    detailText += `L*值: ${record.lStar.toFixed(2)}\n\n`;
    detailText += `采样点详情:\n`;
    record.samplePoints.forEach((point, idx) => {
      detailText += `点${idx + 1}: L*=${point.lab.l.toFixed(2)}, a*=${point.lab.a.toFixed(2)}, b*=${point.lab.b.toFixed(2)}\n`;
    });

    wx.showModal({
      title: '检测详情',
      content: detailText,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  /**
   * 删除单条记录
   */
  deleteRecord(e: any) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.historyList[index];

    wx.showModal({
      title: '确认删除',
      content: `确定要删除这条记录吗？\nAgtron: ${record.agtron} (${record.roastLevel})`,
      success: (res) => {
        if (res.confirm) {
          try {
            const historyStr = wx.getStorageSync('roastHistory') || '[]';
            const history = JSON.parse(historyStr);

            // 根据ID删除记录
            const newHistory = history.filter((item: HistoryRecord) => item.id !== record.id);

            // 保存更新后的历史记录
            wx.setStorageSync('roastHistory', JSON.stringify(newHistory));

            wx.showToast({
              title: '已删除',
              icon: 'success',
            });

            // 重新加载历史记录
            this.loadHistory();
          } catch (error) {
            console.error('删除失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none',
            });
          }
        }
      },
    });
  },

  /**
   * 清空所有历史记录
   */
  clearAllHistory() {
    if (this.data.isEmpty) {
      return;
    }

    wx.showModal({
      title: '确认清空',
      content: `确定要清空所有历史记录吗？\n共${this.data.historyList.length}条记录`,
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('roastHistory');
            wx.showToast({
              title: '已清空',
              icon: 'success',
            });
            this.loadHistory();
          } catch (error) {
            console.error('清空失败:', error);
            wx.showToast({
              title: '清空失败',
              icon: 'none',
            });
          }
        }
      },
    });
  },

  /**
   * 导出历史记录（复制到剪贴板）
   */
  exportHistory() {
    if (this.data.isEmpty) {
      wx.showToast({
        title: '暂无记录',
        icon: 'none',
      });
      return;
    }

    try {
      const historyStr = wx.getStorageSync('roastHistory');
      wx.setClipboardData({
        data: historyStr,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success',
          });
        },
      });
    } catch (error) {
      console.error('导出失败:', error);
      wx.showToast({
        title: '导出失败',
        icon: 'none',
      });
    }
  },
});

